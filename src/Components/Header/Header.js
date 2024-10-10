import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header>
            <nav>
                <ul id='nav-ul' type='none'>
                    <section>
                        <li id='logo' className='cursor-hover'>
                            <h1 className='first logo'>Sarthak Parulekar</h1>
                            <h1 className='second logo'>Sarthak Parulekar</h1>
                        </li>
                    </section>
                    <section className='section-links'>
                        <a href="https://github.com/sarthakdev143-lite" rel="noreferrer" target='_blank' className='cursor-hover'>
                            <li>
                                <i className='ri-github-fill'></i>
                            </li>
                        </a>
                        <a href="https://linkedin.com/in/sarthak-parulekar/" rel="noreferrer" target='_blank' className='cursor-hover'>
                            <li>
                                <i className='ri-linkedin-fill'></i>
                            </li>
                        </a>
                        <a href="https://instagram.com/_sarthak.parulekar" rel="noreferrer" target='_blank' className='cursor-hover'>
                            <li>
                                <i className='ri-instagram-line'></i>
                            </li>
                        </a>
                    </section>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
