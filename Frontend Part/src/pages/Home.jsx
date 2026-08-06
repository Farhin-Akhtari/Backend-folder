import VideoCard from "../components/VideoCard/VideoCard";
import CategoryBar from "../components/CategoryBar/CategoryBar";

const videos = [
  {
    id: 1,
    title: "Learn React",
    channel: "PlayNest",
    views: "120K",
    thumbnail: "https://picsum.photos/320/184",
    duration: "1:00"
  },
   {
    id: 2,
    title: "Learn MongoDb",
    channel: "PlayNest",
    views: "100K",
    thumbnail: "https://picsum.photos/320/185",
    duration: "10:30"
  },
  {
    id: 3,
    title: "Learn DSA",
    channel: "PlayNest",
    views: "500K",
    thumbnail: "https://picsum.photos/320/186",
    duration: "4:00"
  }
]

function Home() {
  return (

   <div>
  
    {/*Category bar */}
      <CategoryBar />

       
       {/*Video grid*/}
    <div className="grid gap-8 mt-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
       {videos.map((video) => (
        <VideoCard
            key={video.id}
            title={video.title}
            channel={video.channel}
            views={video.views}
            thumbnail={video.thumbnail}
            duration={video.duration}
        />
     ))}
    </div>
    
    </div>

  );
}

export default Home;