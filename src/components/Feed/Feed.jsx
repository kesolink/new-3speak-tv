
import "./Feed.scss"
import { Link } from "react-router-dom"
import { IoChevronUpCircleOutline } from "react-icons/io5"
import { GiEternalLove } from "react-icons/gi"
import CommunitiesTags from "../communities-tags/CommunitiesTags"
import { useEffect, useState } from "react"
import Auth_modal from "../modal/Auth_modal"
import { has3SpeakPostAuth } from '../../utils/hiveUtils';
import { useAppStore } from '../../lib/store';
import CardSkeleton from "../Cards/CardSkeleton"
import { useQuery } from "@apollo/client"
import { LATEST_FEED } from "../../graphql/queries"
import Cards from "../Cards/Cards"
function Feed() {
  const [isOpen, setIsOpen] = useState(false)
  const {authenticated, user} = useAppStore();

  useEffect(()=>{
    checkPostAuth(user);
  },[])

  const { data, loading, error } = useQuery(LATEST_FEED);
  const videos = data?.feed?.items || [];


  const toggleUploadModal = ()=>{
    setIsOpen( (prev)=> !prev)
  }

    async function checkPostAuth(username) {
      if(!authenticated){
        return
      }
      const hasAuth = await has3SpeakPostAuth(username);
      if (!hasAuth) {
        setIsOpen(true);
      }
    }

  return (
    <>
    <>
    <CommunitiesTags />

    {loading ? 
        <CardSkeleton /> :
        <Cards videos={videos} loading={loading} error={error} className="custom-video-feed" />
      }
    </>
    {isOpen && <Auth_modal  isOpen={isOpen} close={toggleUploadModal} />}
    </>
  );
}

export default Feed