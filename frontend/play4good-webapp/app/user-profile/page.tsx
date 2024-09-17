'use client';
import { useRouter, useSearchParams } from 'next/navigation'; // Import from 'next/navigation'
import { FormEventHandler, FormHTMLAttributes, useCallback, useEffect, useState } from 'react';
import Modal from './Modal';
import Image from 'next/image';
import styles from '../components/AboutSection.module.css';
import useStorage from '../utils/useStorage';

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

const Page = ({ searchParams }: SearchParamProps) => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const { getItem } = useStorage();
    const [user, setUser] = useState({
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
    });

    // Load data from localStorage on the client side
    useEffect(() => {
        setUser({
            id : getItem('id') || '',
            username: getItem('username') || '',
            firstName: getItem('first_name') || '',
            lastName: getItem('last_name') || '',
            email: getItem('email') || '',
            avatarUrl: getItem('avatarUrl') || 'https://bootdey.com/img/Content/avatar/avatar7.png',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [formData, setFormData] = useState({
        username: user.username || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    avatarUrl: reader.result as string, // Store the base64 encoded image
                }));
            };
            reader.readAsDataURL(file); // Convert file to base64 URL
        }
    };

    async function updateProfile() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({
                ...formData
            }),
        };
        const response = await fetch(api_url+'/api/users/'+ user.id, requestOptions);
        const data = await response.json();
        setUser({
            id : data.id,
            username: data.username,
            firstName: data.first_name.String,
            lastName: data.last_name.String,
            email: data.email,
            avatarUrl: data.avatarUrl.String,
        });
    }
    const handleSubmit = () =>{
        updateProfile();
    }

    const router = useRouter();

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
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
                                src={user.avatarUrl}
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
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalHeader}>Edit Profile</h2>
                        <p className={styles.modalDescription}>
                            Here you can edit your profile information.
                        </p>
                        <div className={styles.modalAvatar}>
                            <Image
                                src={formData.avatarUrl || user.avatarUrl} // Display the selected image or default one
                                alt="Avatar"
                                width={200}
                                height={200}
                                style={{ borderRadius: '100%' }}
                            />
                        </div>

                        <form className={styles.modalForm} onSubmit={handleSubmit}>
                            <label className={styles.fileInputLabel}>
                                Choose Profile Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={styles.fileInput}
                                />
                            </label>

                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username || user.username}
                                onChange={handleChange}
                                required
                                className={styles.modalInput}
                            />
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                value={formData.first_name || user.firstName}
                                onChange={handleChange}
                                required
                                className={styles.modalInput}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                value={formData.last_name || user.lastName}
                                onChange={handleChange}
                                required
                                className={styles.modalInput}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email || user.email}
                                onChange={handleChange}
                                required
                                className={styles.modalInput}
                            />
                            <button type="submit" className={styles.modalButton}>
                                Submit
                            </button>
                        </form>
                    </div>
                </Modal>

            )}
        </section>
    );
};

export default Page;


