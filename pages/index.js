import Image from 'next/image';
import ImageScatter from '../components/ImageScatter'; // Adjust the path if needed

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <p>Here are some images you can click:</p>
      {/* Include the ImageScatter component */}
      <ImageScatter />
      <Image
        src="/images/graphs.jpg" // Path relative to the `public` directory
        alt="graphs"
        width={1500} // Desired width
        height={500} // Desired height
        priority // Optional: loads the image with higher priority
      />
    </div>
  );
};

export default Dashboard;
