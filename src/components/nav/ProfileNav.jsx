import React, { useEffect, useState } from 'react'
import "./ProfileNav.scss"
import { useAppStore } from '../../lib/store';
import { useGetMyQuery } from '../../hooks/getUserDetails';
import { MdCloudUpload, MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { ImPower } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom';
import { FaDiscord, FaLanguage} from 'react-icons/fa';
import { IoPower } from 'react-icons/io5';
import { FaCheckToSlot, FaJxl, FaSquareXTwitter, FaUserGroup } from 'react-icons/fa6';
import { TiThList } from "react-icons/ti";
import { IoMdPerson } from 'react-icons/io';
import { RiWallet3Fill } from 'react-icons/ri';
import logo from "../../assets/image/3S_logo.svg";
import { SiTelegram } from "react-icons/si";
import { getVotePower } from '../../utils/hiveUtils';

function ProfileNav({isVisible, onclose}) {
  const navigate = useNavigate()
  const {  LogOut, user, switchAccount } = useAppStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [votingPower, setVotingPower] = useState(0);
  const [rc, setRc] = useState(0);
    const [accountList, setAccountList] = useState([]);
      
        useEffect(()=>{
          const getAccountlist = JSON.parse(localStorage.getItem("accountsList")) || [];
          setAccountList(getAccountlist)
        },[isVisible])

    const handlewallletNavigation = ()=>{
      navigate(`/wallet/${user}`)
    }
    const handleSwitchAccount = (user)=>{
    switchAccount(user)
    navigate("/")

  }

  const fetchVotePower = async (user) => {
    try{
      const result = await getVotePower(user);
      if (result){
        const { vp, rcPercent } = result;
        setRc(rcPercent.toFixed(2));
        setVotingPower((vp / 100).toFixed(2));
      }
    } catch (err) {
      console.error('Error fetching account:', err);
    }
  }
  useEffect(() => {
    if (!user) return;
    fetchVotePower(user);
  }, []);

  return (
    <div className={`profilenav-container ${isVisible ? 'visible' : ''}`} onClick={()=>{onclose(); setShowDropdown(false)}}>
        <div className="profile-wrap" onClick={(e) => e.stopPropagation()}>
          
           <div className='pro-top-wrap'style={{ backgroundImage: `url(https://images.hive.blog/u/${user}/cover)`, backgroundSize: "cover", backgroundPosition: "center",}}> 
            {/* <img className='' src={getUserProfile?.images?.cover} alt="" /> */}
            <img className='avatar-img' src={`https://images.hive.blog/u/${user}/avatar`}  alt="" />
            <span className='username'>{user}</span>
            <div className="power-wrap">
            <div className="wrap-in">
              <div className="wrap">
                <MdOutlineKeyboardArrowUp />
                <span>{votingPower}% {" "} VP</span>
              </div>
              <div class="tooltip">
                Voting Power
                <div class="tooltip-arrow"></div>
              </div>
            </div>
            <div className="wrap-in">
              <div className="wrap">
              <MdKeyboardArrowDown />
              <span>{rc}% {" "} RC</span>
              </div>
              <div class="tooltip">
                Resource Credit
                <div class="tooltip-arrow"></div>
              </div>
              </div>

            </div>
           </div>
           <div className="list-wrap">
          <Link to="/profile"  className="wrap" onClick={onclose}>
            <IoMdPerson className="icon" /> <span>My Channel</span>
          </Link>
          <Link to="/draft" className="wrap" onClick={onclose}>
            <TiThList className="icon" /> <span>Playlist</span>
          </Link>
          <Link  to="/studio" className="wrap" onClick={onclose}>
            <MdCloudUpload className="icon" /> <span>Upload Video</span>
          </Link>
          <div className="wrap" onClick={()=>{handlewallletNavigation(); onclose()}}>
            <RiWallet3Fill className="icon" /> <span>Wallet</span>
          </div>
          <div  className="wrap dropdown-parent" onClick={() => setShowDropdown(!showDropdown)}>
            <FaUserGroup className="icon" /> <span>Switch User</span>
            {showDropdown && accountList.length > 0 &&(<div className="dropdown-menu">
              <span className='close-btn' onClick={() => setShowDropdown(!showDropdown)}>x</span>
              {accountList.map((list, index)=>(
                <div key={index} className="list" onClick={(e)=>{e.stopPropagation(); handleSwitchAccount(list.username); setShowDropdown(!showDropdown); onclose()}}> <img src={`https://images.hive.blog/u/${list.username}/avatar`} alt="" /> <span>{list.username}</span></div>
              ))}
              <Link to="/login" onClick={()=>{onclose()}}><button>Add Account</button></Link>
            </div>)}
          </div> 
          <Link  className="wrap">
            <FaLanguage className="icon" /> <span>Language Settings</span>
          </Link>
          <Link to={"/login"} onClick={()=>{LogOut();onclose()}} className="wrap">
            <IoPower className="icon" /> <span>Logout</span>
          </Link>
           </div>
           <div className="logo-wrap">
           <img className="logo" src={logo} alt="" />
           </div>
        <div className="support-wrap">
          <a href="https://x.com/3speaktv?utm_source=3speak.tv" className="social-link" target="_blank" rel="noopener noreferrer">
            <FaDiscord size={30} />
          </a>
          <a href="https://discord.com/invite/NSFS2VGj83" className="social-link" target="_blank" rel="noopener noreferrer">
            <FaSquareXTwitter size={30} />
          </a>
          <a href="https://t.me/threespeak?utm_source=3speak.tv" className="social-link" target="_blank" rel="noopener noreferrer">
            <SiTelegram size={30} />
          </a>

        </div>
           
           <span className='close-btn' onClick={onclose}>X</span>
        </div>
    </div>
  )
}

export default ProfileNav