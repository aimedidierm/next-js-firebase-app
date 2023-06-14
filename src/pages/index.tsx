import Head from 'next/head';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, updateDoc, where } from "@firebase/firestore";
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import '../styles/global.css';

interface Category {
  id: string;
  title: string;
}

interface Tool {
  id: string;
  title: string;
  description: string;
  categoryId: string;
}

const Home: NextPage = () => {
  const [categories, setCategories] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [tools, setTools] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCategories();
    getTools();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const categoriesCollection = collection(firestore, 'categories');
  const toolsCollection = collection(firestore, 'tools');

  const getCategories = async () => {
    const categoriesQuery = query(categoriesCollection, limit(10));
    const querySnapshot = await getDocs(categoriesQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    setCategories(result);
  };

  const getTools = async () => {
    const toolsQuery = query(toolsCollection, limit(10));
    const querySnapshot = await getDocs(toolsQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    setTools(result);
  };

  const deleteCategory = async (documentId: string) => {
    const categoryRef = doc(firestore, `categories/${documentId}`);
    await deleteDoc(categoryRef);
    getCategories();
  };

  const deleteTool = async (documentId: string) => {
    const toolRef = doc(firestore, `tools/${documentId}`);
    await deleteDoc(toolRef);
    getTools();
  };

  const router = useRouter();

  const navigateToCategoryUpdatePage = (categoryId: string) => {
    router.push(`/update-category?categoryId=${categoryId}`);
  }

  const navigateToToolUpdatePage = (toolId: string) => {
    router.push(`/update-tool?toolId=${toolId}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tools and category management</title>
        <meta name="description" content="Tools and categories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Tools and category management</h1>
        <a href="/add-category">New category</a>
        <a href="/add-tool">New tool</a>
        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>Categories</h2>
              <div className={styles.grid}>
                {loading ? (
                  <div className={styles.card}>
                    <h2>Loading</h2>
                  </div>
                ) : categories.length === 0 ? (
                  <div className={styles.card}>
                    <h2>No categories</h2>
                    <p>You can add one by clicking <a href="/add-category">here</a></p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div className={styles.card} key={category.id}>
                      <h2>{category.data().title}</h2>
                      <div className={styles.cardActions}>
                        <button type="button" className={styles.update} onClick={() => navigateToCategoryUpdatePage(category.id)}>Update</button>
                        <button type="button" className={styles.delete} onClick={() => deleteCategory(category.id)}>Delete</button>

                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.column}>
              <h2>Tools</h2>
              <div className={styles.grid}>
                {loading ? (
                  <div className={styles.card}>
                    <h2>Loading</h2>
                  </div>
                ) : tools.length === 0 ? (
                  <div className={styles.card}>
                    <h2>No tools</h2>
                    <p>You can add one by clicking <a href="/add-tool">here</a></p>
                  </div>
                ) : (
                  tools.map((tool) => (
                    <div className={styles.card} key={tool.id}>
                      <h2>{tool.data().title}</h2>
                      <p>{tool.data().description}</p>
                      <div className={styles.cardActions}>
                        <button type="button" className={styles.update} onClick={() => navigateToToolUpdatePage(tool.id)}>Update</button>
                        <button type="button" className={styles.delete} onClick={() => deleteTool(tool.id)}>Delete</button>
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
        <a href="#" rel="noopener noreferrer">
          Tools and category management
        </a>
      </footer>
    </div>
  );
};

export default Home;
