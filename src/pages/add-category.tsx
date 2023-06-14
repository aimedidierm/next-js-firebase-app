import { doc } from '@firebase/firestore';
import { setDoc } from 'firebase/firestore';
import type { NextPage } from 'next'
import Head from "next/head";
import { useState } from 'react';
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css'

const AddCategory: NextPage = () => {

    const [title, setTitle] = useState<string>(""); // title
    const [error, setError] = useState<string>("");// error
    const [message, setMessage] = useState<string>("");// message

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // avoid default behaviour

        if (!title) { // check for any null value
            return setError("Title is required");
        }
        addCategory();
    }

    const addCategory = async () => {
        // get the current timestamp
        const timestamp: string = Date.now().toString();
        // create a pointer to our document
        const _Category = doc(firestore, `categories/${timestamp}`);
        // structure the Category data
        const CategoryData = {
            title,
        };

        try {
            //add the document
            await setDoc(_Category, CategoryData);
            //show a success message
            setMessage("Category added successfully");
            //reset fields
            setTitle("");
        } catch (error) {
            //show an error message
            setError("An error occurred while adding Category");
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Add category</title>
                <meta name="description" content="Tools and categories" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>

                <h1 className={styles.title}>
                    Add category
                </h1>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {
                        error ? (
                            <div className={styles.formGroup}>
                                <p className={styles.error}>{error}</p>
                            </div>
                        ) : null
                    }

                    {
                        message ? (
                            <div className={styles.formGroup}>
                                <p className={styles.success}>
                                    {message}. Proceed to <a href="/">Home</a>
                                </p>
                            </div>
                        ) : null
                    }

                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input type="text"
                            placeholder="category title"
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <button type="submit">Submit</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default AddCategory;