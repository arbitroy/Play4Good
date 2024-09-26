'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../components/AboutSection.module.css';
import getCookie from '../utils/cookieHandler';
import useStorage from '../utils/useStorage';
import Modal from './Modal';

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
};

type FormData = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatarUrl: string;
};


type ApiResponse = {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name: { String: string; Valid: boolean };
    last_name: { String: string; Valid: boolean };
    avatarUrl: { String: string; Valid: boolean };
    created_at: { Time: string; Valid: boolean };
    updated_at: { Time: string; Valid: boolean };
};

const Page = ({ searchParams }: SearchParamProps) => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const { getItem, setItem } = useStorage();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState<User>({
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
    });

    const [formData, setFormData] = useState<FormData>({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        avatarUrl: '',
    });

    const router = useRouter();
    const searchParamsObj = useSearchParams();
    const show = searchParams?.show === 'true';

    useEffect(() => {
        const loadedUser = {
            id: getItem('id') || '',
            username: getItem('username') || '',
            firstName: getItem('first_name') || '',
            lastName: getItem('last_name') || '',
            email: getItem('email') || '',
            avatarUrl: getItem('avatarUrl') || 'https://bootdey.com/img/Content/avatar/avatar7.png',
        };
        setUser(loadedUser);
        setFormData({
            username: loadedUser.username,
            first_name: loadedUser.firstName,
            last_name: loadedUser.lastName,
            email: loadedUser.email,
            avatarUrl: loadedUser.avatarUrl,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should not exceed 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    avatarUrl: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Valid email is required');
            return false;
        }
        return true;
    };

    const updateProfile = async () => {
        if (!validateForm()) return;

        try {
            const token = getCookie('token');
            if (!token) {
                setError('Authentication token is missing. Please log in again.');
                return;
            }

            const response = await fetch(`${api_url}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            console.log("response:",JSON.stringify(formData));

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            console.log("response:",data);
            const updatedUser: User = {
                id: data.id.toString(),
                username: data.username,
                firstName: data.first_name.Valid ? data.first_name.String : '',
                lastName: data.last_name.Valid ? data.last_name.String : '',
                email: data.email,
                avatarUrl: data.avatarUrl.Valid ? data.avatarUrl.String : user.avatarUrl,
            };

            setUser(updatedUser);

            // Update localStorage
            setItem('id', updatedUser.id);
            setItem('username', updatedUser.username);
            setItem('first_name', updatedUser.firstName);
            setItem('last_name', updatedUser.lastName);
            setItem('email', updatedUser.email);
            setItem('avatarUrl', updatedUser.avatarUrl);

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to update profile: ${error.message}`);
            } else {
                setError('An unexpected error occurred');
            }
            console.error('There was an error!', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openModal = () => {
        const currentPath = window.location.pathname;
        const updatedQuery = new URLSearchParams(searchParamsObj);
        updatedQuery.set('show', 'true');
        router.push(`${currentPath}?${updatedQuery.toString()}`);
    };

    const closeModal = () => {
        const currentPath = window.location.pathname;
        const updatedQuery = new URLSearchParams(searchParamsObj);
        updatedQuery.delete('show');
        router.push(`${currentPath}?${updatedQuery.toString()}`);
    };

    return (
        <section className={`${styles.section}`} id="about">
            <div className={styles.container}>
                <div className={`${styles.row} ${styles.flexRowReverse}`}>
                    <div className={styles.colLg6}>
                        <div className={`${styles.aboutText} ${styles.goTo}`}>
                            <h3 className={styles.darkColor}>
                                Profile
                                <span className={styles.editIcon}>
                                    <i className="fas fa-pencil-alt" onClick={openModal}></i>
                                </span>
                            </h3>
                            <h6 className={`${styles.themeColor} ${styles.lead}`}>
                                A team player &amp; avid supporter of charity
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

            {show && (
                <Modal onClose={closeModal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalHeader}>Edit Profile</h2>
                        <p className={styles.modalDescription}>
                            Here you can edit your profile information.
                        </p>
                        <div className={styles.modalAvatar}>
                            <Image
                                src={formData.avatarUrl || user.avatarUrl}
                                alt="Avatar"
                                width={200}
                                height={200}
                                style={{ borderRadius: '100%' }}
                            />
                        </div>

                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

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
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={styles.modalInput}
                            />
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={styles.modalInput}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={styles.modalInput}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
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