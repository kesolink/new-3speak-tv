import React from 'react'
import "./FirstUploads.scss"
import { useEffect } from "react"
import { useQuery } from '@apollo/client'
import { NEW_CONTENT } from '../graphql/queries'
import Cards from '../components/Cards/Cards'
import CardSkeleton from '../components/Cards/CardSkeleton'
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import Card3 from "../components/Cards/Card3";

// const fetchVideos = async ({ pageParam = 1 }) => {
//   const LIMIT = 300;
//   const res = await axios.get(
//     // `https://3speak.tv/apiv2/feeds/new?page=${pageParam}`
//     `https://3speak.tv/apiv2/feeds/new?limit=${LIMIT}`
//   );
//   return res.data;
// };

const fetchVideos = async ({ pageParam = 0 }) => {
  let url;
  const LIMIT = 300;

  // On first load, use /feeds/trending
  if (pageParam === 0) {
    url = `https://3speak.tv/apiv2/feeds/new?limit=${LIMIT}`;
  } 
  // On later loads, use /feeds/trending/more with skip
  else {
    url = `https://3speak.tv/apiv2/feeds/new/more?skip=100`;
  }

  const res = await axios.get(url);
  // Notice: trending returns an array, while /more returns { trends: [...] }
  return res.data.trends || res.data;
};



const NewVideos = () => {
  const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
    } = useInfiniteQuery({
      queryKey: ["new"],
      queryFn: fetchVideos,
      getNextPageParam: (lastPage, allPages) => {
        // If lastPage returned data, calculate new skip
        const currentTotal = allPages.flat().length;
        if (lastPage && lastPage.length > 0) return currentTotal;
        return undefined; // Stop when no more data
      },
    });

  useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 200 &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);
  
    // Flatten all pages into a single array
    const videos = data?.pages.flat() || [];
    console.log(videos)
    

  

  return (
    <div className='firstupload-container'>
      <div className='headers'>New VIDEOS</div>
      {isLoading ? <CardSkeleton /> :  <Card3 videos={videos} loading={isFetchingNextPage} />}
    {isError && <p>Error fetching videos</p>}
      {isFetchingNextPage && (
        <p style={{ textAlign: "center" }}>Loading more...</p>
      )}
    </div>
  );
};

export default NewVideos;
