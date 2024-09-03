'use client'
import Image from 'next/image';
import styles from '../components/AboutSection.module.css';
import { useEffect, useState } from 'react';
import useStorage from '../utils/useStorage';

const Page = () => {
    const { getItem } = useStorage();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        avatar: '',
    });

    // Load data from localStorage on the client side
    useEffect(() => {
        setUser({
            firstName: getItem('first_name') || '',
            lastName: getItem('last_name') || '',
            email: getItem('email') || '',
            avatar: getItem('avatarUrl') || 'https://bootdey.com/img/Content/avatar/avatar7.png',
        });
    }, [getItem]);

    return (
        <section className={`${styles.section}`} id="about">
            <div className={styles.container}>
                <div className={`${styles.row} ${styles.flexRowReverse}`}>
                    <div className={styles.colLg6}>
                        <div className={`${styles.aboutText} ${styles.goTo}`}>
                            <h3 className={styles.darkColor}>Profile</h3>
                            <h6 className={`${styles.themeColor} ${styles.lead}`}>
                                A Lead UX &amp; UI designer based in Canada
                            </h6>
                            <div className={styles.rowAboutList}>
                                <div className={styles.colMd6}>
                                    <div className={styles.media}>
                                        <label>First Name</label>
                                        <p>{user.firstName}</p>
                                    </div>
                                    <div className={styles.media}>
                                        <label>Last Name</label>
                                        <p>{user.lastName}</p>
                                    </div>
                                </div>
                                <div className={styles.colMd6}>
                                    <div className={styles.media}>
                                        <label>E-mail</label>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.colLg6}>
                        <div className={styles.aboutAvatar}>
                            <Image
                                src={user.avatar}
                                alt="Avatar"
                                width={350} // Adjust width as needed
                                height={350} // Adjust height as needed
                                style={{ borderRadius: "100%" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
