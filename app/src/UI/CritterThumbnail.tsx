import React, { useState } from 'react';

interface ICritterThumbnailProps {
    path: string;
    name: string;
}

function CritterThumbnail(props: React.PropsWithChildren<ICritterThumbnailProps>) {
    const { path, name } = props;

    const [thumbnail, setThumbnail] = useState(undefined as undefined | string);

    const loadImage = () => {
        // create an image object to load our thumbnail into
        const thumb = new Image();
        // when the thumbnail has loaded, set the component's src
        thumb.onload = () => {
            setThumbnail(path);
        }
        // start the thumbnail loading
        thumb.src = path;
        
    }

    // fetch the thumbnail if we don't already have it
    if(!thumbnail) {
        loadImage();
    }

    // show a loading spinner instead of the thumbnail if the thumbnail hasn't loaded yet
    return (
        <img src={thumbnail || 'img/loader.gif'} alt={name} />
    );
}

export default CritterThumbnail;
