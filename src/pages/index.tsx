import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { firestore } from '../firebase/clientApp'
import { collection, deleteDoc, doc, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, updateDoc, where } from "@firebase/firestore";
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  title: string;
}

const Home: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCategories();
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  }, []);

  const categoriesCollection = collection(firestore, 'categories');

  const getCategories = async () => {
    const categoriesQuery = query(categoriesCollection, limit(10));
    const querySnapshot = await getDocs(categoriesQuery);
    const result: Category[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push({ id: snapshot.id, title: snapshot.data().title });
    })
    setCategories(result);
  };

  const deleteCategory = async (documentId: string) => {
    const categoryRef = doc(firestore, `categories/${documentId}`);
    await deleteDoc(categoryRef);
    getCategories();
  }

  const router = useRouter();

  const navigateToUpdatePage = (categoryId: string) => {
    router.push(`/update-category?categoryId=${categoryId}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tools and category management</title>
        <meta name="description" content="Tools and categories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tools and category management
        </h1>
        {/* <Link href="/add-category">
          <a>New category</a>
        </Link> */}
        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.grid}>
                {loading ? (
                  <div className={styles.card}>
                    <h2>Loading</h2>
                  </div>
                ) : categories.length === 0 ? (
                  <div className={styles.card}>
                    <h2>No categories</h2>
                    <p>You can add it by clicking <Link href="/add-category"><a>here</a></Link></p>
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <div className={styles.card} key={index}>
                      <h2>{category.title}</h2>
                      <div className={styles.cardActions}>
                        <button type="button" onClick={() => deleteCategory(category.id)}>Delete</button>
                        <button type="button" onClick={() => navigateToUpdatePage(category.id)}>Update</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="#"
          rel="noopener noreferrer"
        >
          Tools and category management
        </a>
      </footer>
    </div>
  )
}

export default Home;
