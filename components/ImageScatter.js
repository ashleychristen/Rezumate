import Link from 'next/link';
import Image from 'next/image';
import styles from './ImageScatter.module.css'; // Ensure this path is correct

const ImageScatter = () => {
  return (
    <div className={styles.flexContainer}>
      <Link href="/new" className={styles.imageLink}> {/* Link to the first page */}
        <Image src="/images/new.png" alt="Image 1" width={150} height={150} />
      </Link>
      <Link href="/shortlisted" className={styles.imageLink}> {/* Link to the second page */}
        <Image src="/images/shortlist.png" alt="Image 2" width={150} height={150} />
      </Link>
      <Link href="/rejected" className={styles.imageLink}> {/* Link to the third page */}
        <Image src="/images/reject.png" alt="Image 3" width={150} height={150} />
      </Link>
      <Link href="/react-graphs" className={styles.imageLink}> {/* Link to the third page */}
        <Image src="/images/graph.png" alt="Image 3" width={150} height={150} />
      </Link>
    </div>
  );
};

export default ImageScatter;
