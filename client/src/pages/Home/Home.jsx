import React from 'react'
import "./home.scss"
import Posts from '../../components/posts/Posts'
import Share from '../../components/share/Share'

const Home = () => {
  return (
    <div className='homepage'>
        <Share />
        <Posts />
    </div>
  )
}

export default Home