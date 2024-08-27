import Image from 'next/image';
import styles from '../components/AboutSection.module.css';

const Page = () => {
    return (
        <section className={`${styles.section} `} id="about">
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
                                        <label>Residence</label>
                                        <p>Canada</p>
                                    </div>
                                    <div className={styles.media}>
                                        <label>Address</label>
                                        <p>California, USA</p>
                                    </div>
                                </div>
                                <div className={styles.colMd6}>
                                    <div className={styles.media}>
                                        <label>E-mail</label>
                                        <p>info@domain.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.colLg6}>
                        <div className={styles.aboutAvatar}>
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                alt="Avatar"
                                style={{ width: "65%", borderRadius: "100%" }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Page;
