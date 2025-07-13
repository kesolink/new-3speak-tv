import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@hiveio/dhive';
import './UpvoteTooltip.scss';
import { useAppStore } from '../../lib/store';
import { IoChevronUpCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUersContent, getVotePower } from '../../utils/hiveUtils';
import { TailChase } from 'ldrs/react';
import 'ldrs/react/TailChase.css';
import axios from 'axios';



const client = new Client(['https://api.hive.blog']);

const CardVoteTooltip = ({ author, permlink, showTooltip, setShowTooltip, setVotedPosts, cardStyle }) => {
  const { user, authenticated, clearAccount, LogOut } = useAppStore();
  const [votingPower, setVotingPower] = useState(100);
  const [weight, setWeight] = useState(100);
  const [voteValue, setVoteValue] = useState(0.0);
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip, setShowTooltip]);

  useEffect(() => {
    if (!user || !showTooltip) return;

    const fetchAccountData = async () => {
      try {
        const result = await getVotePower(user);
        if (result) {
          const { vp, account } = result;
          setVotingPower((vp / 100).toFixed(2));
          setAccountData(account);
          calculateVoteValue(account, weight, vp);
        }
      } catch (err) {
        console.error('Error fetching account:', err);
      }
    };

    fetchAccountData();
  }, [user, showTooltip]);

  useEffect(() => {
    if (!accountData || !votingPower) return;
    const vp = parseFloat(votingPower) * 100;
    calculateVoteValue(accountData, weight, vp);
  }, [weight]);

  const calculateVoteValue = async (account, weight, vp) => {
    try {
      const rewardFund = await client.database.call('get_reward_fund', ['post']);
      const feedPrice = await client.database.call('get_current_median_history_price');
      const props = await client.database.call('get_dynamic_global_properties');

      const vestingShares = parseFloat(account.vesting_shares.replace(' VESTS', ''));
      const delegated = parseFloat(account.delegated_vesting_shares.replace(' VESTS', ''));
      const received = parseFloat(account.received_vesting_shares.replace(' VESTS', ''));
      const effectiveVesting = vestingShares + received - delegated;

      const totalFund = parseFloat(props.total_vesting_fund_hive.replace(' HIVE', ''));
      const totalShares = parseFloat(props.total_vesting_shares.replace(' VESTS', ''));

      const sp = (effectiveVesting * totalFund) / totalShares;
      const rshares = (sp * 100 * (vp / 10000) * (weight / 100)) / 50;

      const rewardBalance = parseFloat(rewardFund.reward_balance.replace(' HIVE', ''));
      const recentClaims = parseFloat(rewardFund.recent_claims);
      const hivePrice = parseFloat(feedPrice.base) / parseFloat(feedPrice.quote);

      const estimated = (rshares * rewardBalance * hivePrice) / recentClaims;
      setVoteValue(estimated.toFixed(2));
    } catch (err) {
      console.error('Vote value calculation failed:', err);
    }
  };

  const handleVote = async () => {
    if (!authenticated) {
      toast.error('Login to complete this operation');
      return;
    }

    setIsLoading(true);
    const voteWeight = Math.round(weight * 100);

    try {
      const data = await getUersContent(author, permlink);
      const existingVote = data.active_votes.find((vote) => vote.voter === user);

      if (existingVote) {
        if (existingVote.percent === voteWeight) {
          toast.info('Previous value is not acceptable. Vote with a different value.');
          setIsLoading(false);
          return;
        }
      }


      const response = await axios.post('https://studio.3speak.tv/mobile/vote', {
              author,
              permlink,
              weight: voteWeight
            }, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              }
            });

            console.log('Vote response:', response.data);
      if (response.data.success) {
        toast.success('Vote successful');
        setVotedPosts((prev) => [...prev, `${author}/${permlink}`]);
      }
      setIsLoading(false);
         setShowTooltip(false);




    } catch (err) {
      console.error('Vote failed:', err);
      toast.error('Vote failed, please try again');
      setIsLoading(false);
      setShowTooltip(false);
    }
  };

  return (
    <div className="upvote-tooltip-wrap" ref={tooltipRef} onClick={(e) => e.preventDefault()}>
      {showTooltip && (
        <div className="tooltip-box card">
          <p>Vote Weight: {weight}%</p>
          <div className="wrap">
            {isLoading ? (
<div className='wrap-circle'><TailChase className="loader-circle" size="15" speed="1.5" color="red" /></div>            ) : (
              <IoChevronUpCircleOutline size={30} onClick={handleVote} />
            )}
            <input
              type="range"
              min="1"
              max="100"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <p>${voteValue}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardVoteTooltip;
