import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css';
import '../styles/global.css';

interface Category {
    id: string;
    title: string;
}

const AddTool = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'categories'));
            const categoriesData: Category[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
            }));
            setCategories(categoriesData);
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create a pointer to the tool document
        const toolRef = doc(firestore, 'tools');

        // Set the tool data
        try {
            await setDoc(toolRef, {
                title,
                description,
                categoryId,
            });
            router.push('/');
        } catch (error) {
            console.error('Error adding tool:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h1 className={styles.title}>Add Tool</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Tool title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            placeholder="Tool description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTool;
