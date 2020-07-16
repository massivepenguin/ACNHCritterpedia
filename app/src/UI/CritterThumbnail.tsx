import React, { useState } from 'react';

interface ICritterThumbnailProps {
    path: string;
    name: string;
}

function CritterThumbnail(props: React.PropsWithChildren<ICritterThumbnailProps>) {
    const { path, name } = props;

    const [thumbnail, setThumbnail] = useState(undefined as undefined | string);

    const fetchData = () => {
        // fetch the blob data for the critter's thumbnail and set it to the compnent's state
        fetch(path).then(response => response.blob()).then(data =>{
            const imgReader = new FileReader();
            imgReader.onloadend = () => {
                if(typeof imgReader.result === 'string') {
                    setThumbnail(imgReader.result);
                }
            }
            imgReader.readAsDataURL(data);
        }).catch(error => {
            console.error(`error loading thumbnail for ${name}:`, error);
        });
    }

    // fetch the thumbnail if we don't already have it
    if(!thumbnail) {
        fetchData();
    }

    // show a loading spinner instead of the thumbnail if the thumbnail hasn't loaded yet
    return (
        <img src={thumbnail || 'img/loader.gif'} alt={name} />
    );
}

export default CritterThumbnail;
