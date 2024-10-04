// components/ImageScatter.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './ImageScatter.module.css';

const ImageScatter = () => {
  return (
    <div className={styles.flexContainer}>
      <Link href="/new">
        <div className={styles.imageItem}>
          <Image src="/images/papers.png" alt="Image 1" width={150} height={150} />
        </div>
      </Link>
      <Link href="/shortlisted">
        <div className={styles.imageItem}>
          <Image src="/images/papers.png" alt="Image 2" width={150} height={150} />
        </div>
      </Link>
      <Link href="/rejected">
        <div className={styles.imageItem}>
          <Image src="/images/papers.png" alt="Image 3" width={150} height={150} />
        </div>
      </Link>
    </div>
  );
};

export default ImageScatter;
