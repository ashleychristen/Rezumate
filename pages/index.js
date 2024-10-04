import Image from 'next/image';
import Head from 'next/head';
import ImageScatter from '../components/ImageScatter'; // Adjust the path if needed
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  return (
    <div>
    <Head>
    <title>Dashboard</title> {/* Set the title of the page */}
    <meta name="description" content="A website showcasing images" />
    <link rel="icon" href="/favicon.ico" /> {/* Favicon link */}
      </Head>
      <h1 className={styles.title}>Welcome to My Website</h1>
      <p className={styles.description}>Here are some images you can click:</p>
      <div className={styles.imageContainer}>
        <ImageScatter /> {/* Include your ImageScatter component here */}
      </div>
      <div className={styles.imageContainer}>
      <Image
        src="/images/graphs.jpg" // Path relative to the `public` directory
        alt="graphs"
        width={1500} // Desired width
        height={500} // Desired height
        priority // Optional: loads the image with higher priority
      />
      </div>
    </div>
  );
};

export default Dashboard;
