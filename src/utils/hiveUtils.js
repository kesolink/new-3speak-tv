import { Client } from '@hiveio/dhive';

// Connect to a Hive node
const client = new Client([
    "https://api.hive.blog",
    "https://api.openhive.network"
]);

export async function has3SpeakPostAuth(username) {
    try {
        // Fetch user account details
        const accounts = await client.database.getAccounts([username]);

        if (!accounts.length) {
            console.error(`User ${username} not found.`);
            return false;
        }

        // Log the full account details for debugging
        console.log("User Account Details:", accounts);

        // Safely extract posting auths
        const postingAuths = accounts[0]?.posting?.account_auths?.map(auth => auth[0]) || [];


        // Check if "threespeak" is in the posting auths
        return postingAuths.includes("threespeak");
    } catch (error) {
        console.error("Error checking 3Speak post authorization:", error);
        return false;
    }
}

export async function getUersContent(author, permlink) {
    try {
      const post = await client.database.call("get_content", [author, permlink]);
      // console.log("post===>", post.body);

      if (!post ) {
        console.log("Post not found");
        return null;
      }
      // Use the post body as the content
      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  export const vestsToRshares = (vests, votingPower, votePerc) => {
    const vestingShares = vests * 1e6;
    const power = (votingPower * votePerc) / 1e4 / 50 + 1;
    return (power * vestingShares) / 1e4;
  };

  export const getVotePower = async (username) => {
    try {
      // Get full account data
        const [account] = await client.database.getAccounts([username]);

        // --- Calculate Voting Power ---
        const lastVote = new Date(account.last_vote_time + 'Z');
        const now = new Date();
        const secondsSinceLastVote = (now - lastVote) / 1000;
        const regenerated = (10000 * secondsSinceLastVote) / (5 * 60 * 60 * 24);
        let vp = account.voting_power + regenerated;
        if (vp > 10000) vp = 10000;

        // --- Get RC ---
    const rcData = await client.call('rc_api', 'find_rc_accounts', { accounts: [username] });
    const rcAccount = rcData.rc_accounts?.[0];

    const maxRC = parseFloat(rcAccount.max_rc);
    const currentRC = parseFloat(rcAccount.rc_manabar.current_mana);
    const rcPercent = (currentRC / maxRC) * 100;
        return {
      vp,       // voting power
      rcPercent, // Resource Credit (0 - 100)
      account,  // full account data
      rc: rcAccount,    // Raw RC data
    };
    } catch (error) {
        console.error("Error fetching voting power:", error);
        return null;
    }
  }

  export const getRewardPool = async () => {
  try {
    const rewardFund = await client.database.call('get_reward_fund', ['post']);
    const rewardPool = await client.database.call('get_current_median_history_price');
    
    return {
      reward_balance: parseFloat(rewardFund.reward_balance.split(' ')[0]),
      recent_claims: parseFloat(rewardFund.recent_claims),
      hive_price: parseFloat(rewardPool.base.split(' ')[0]) / parseFloat(rewardPool.quote.split(' ')[0])
    };
  } catch (error) {
    console.error("Error fetching reward pool:", error);
    return {
      reward_balance: 0,
      recent_claims: 0,
      hive_price: 0
    };
  }
};

export async function getFollowers(username, start = '', limit = 100) {
  try {
    const result = await client.call('condenser_api', 'get_followers', [username, start, 'blog', limit]);
    return result.map(f => f.follower);
  } catch (e) {
    console.error('Error getting followers:', e);
    return [];
  }
}

// Get following
export async function getFollowing(username, start = '', limit = 100) {
  try {
    const result = await client.call('condenser_api', 'get_following', [username, start, 'blog', limit]);
    return result.map(f => f.following);
  } catch (e) {
    console.error('Error getting following:', e);
    return [];
  }
}