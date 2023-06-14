import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css';
import '../styles/global.css';

interface Category {
    id: string;
    title: string;
}

const UpdateCategory: NextPage = () => {
    const router = useRouter();
    const { categoryId } = router.query;

    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (categoryId) {
            getCategory(categoryId.toString());
        }
    }, [categoryId]);

    const getCategory = async (categoryId: string) => {
        try {
            const categoryRef = doc(firestore, `categories/${categoryId}`);
            const categorySnapshot = await getDoc(categoryRef);

            if (categorySnapshot.exists()) {
                const categoryData = categorySnapshot.data() as Category;
                setTitle(categoryData.title);
            } else {
                setError("Category not found");
            }
        } catch (error) {
            setError("An error occurred while fetching the category");
        }
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!title) {
            return setError("Title is required");
        }

        updateCategory();
    };

    const updateCategory = async () => {
        const categoryRef = doc(firestore, `categories/${categoryId}`);

        const updatedCategory: { [key: string]: any } = {
            title: title,
        };

        try {
            await updateDoc(categoryRef, updatedCategory);
            setMessage("Category updated successfully");
        } catch (error) {
            setError("An error occurred while updating the category");
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Update category</title>
                <meta name="description" content="Tools and categories" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <h1 className={styles.title}>Update category</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.formGroup}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className={styles.formGroup}>
                            <p className={styles.success}>
                                {message}. Proceed to <a href="/">Home</a>
                            </p>
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="category title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <button type="submit" className={styles.update}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
