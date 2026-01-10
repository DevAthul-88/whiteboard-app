import React from 'react'
import LogoImage from '../../../public/Logo.svg';
import Image from 'next/image';

function Logo() {
    return (
        <div>
           <Image src={LogoImage} alt='logo' width={160}/>
        </div>
    )
}

export default Logo