import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css';
import '../styles/global.css';

const UpdateTool = () => {
    const router = useRouter();
    const { toolId } = router.query;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the existing tool data
                const toolSnapshot = await getDoc(doc(firestore, `tools/${toolId}`));
                if (toolSnapshot.exists()) {
                    const toolData = toolSnapshot.data();
                    setTitle(toolData.title);
                    setDescription(toolData.description);
                }
            } catch (error) {
                console.error('Error fetching tool data:', error);
            }
        };

        fetchData();
    }, [toolId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create a pointer to the tool document
        const toolRef = doc(firestore, `tools/${toolId}`);

        // Update the tool data
        try {
            await updateDoc(toolRef, {
                title,
                description,
            });
            router.push('/');
        } catch (error) {
            console.error('Error updating tool:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h1 className={styles.title}>Update Tool</h1>

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
                        <button type="submit" className={styles.update}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTool;
