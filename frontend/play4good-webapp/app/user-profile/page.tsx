'use client';
import { useRouter, useSearchParams } from 'next/navigation'; // Import from 'next/navigation'
import { useEffect, useState } from 'react';
import Modal from './Modal';
import Image from 'next/image';
import styles from '../components/AboutSection.module.css';

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

const Page = ({ searchParams }: SearchParamProps) => {
    const router = useRouter();
    const searchParamsObj = useSearchParams(); // Hook to get current query params
    const show = searchParams?.show === 'true'; // Check if "show" param is "true"

    const openModal = () => {
        const currentPath = window.location.pathname; // Get current path (e.g., "/user-profile")
        const updatedQuery = new URLSearchParams(searchParamsObj); // Use current query params
        updatedQuery.set('show', 'true'); // Add or update "show=true"

        router.push(`${currentPath}?${updatedQuery.toString()}`); // Push the updated query without losing the path
    };

    const closeModal = () => {
        const currentPath = window.location.pathname; // Get current path
        const updatedQuery = new URLSearchParams(searchParamsObj); // Get current query params
        updatedQuery.delete('show'); // Remove the "show" query parameter

        router.push(`${currentPath}?${updatedQuery.toString()}`); // Update URL without changing path
    };

    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    };

    return (
        <section className={`${styles.section}`} id="about">
            <div className={styles.container}>
                <div className={`${styles.row} ${styles.flexRowReverse}`}>
                    <div className={styles.colLg6}>
                        <div className={`${styles.aboutText} ${styles.goTo}`}>
                            <h3 className={styles.darkColor}>
                                Profile
                                {/* Pencil icon to open the modal */}
                                <span className={styles.editIcon}>
                                    <i className="fas fa-pencil-alt" onClick={openModal}></i>
                                </span>
                            </h3>
                            <h6 className={`${styles.themeColor} ${styles.lead}`}>
                                A team player &amp; avid supporr of charity
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
                                width={350}
                                height={350}
                                style={{ borderRadius: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal is conditionally rendered based on the "show" parameter */}
            {show && (
                <Modal onClose={closeModal}>
                    <div>
                        <h2>Edit Profile</h2>
                        <p>Here you can edit your profile information.</p>
                    </div>
                </Modal>
            )}
        </section>
    );
};

export default Page;
