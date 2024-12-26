// You need to import the CSS only once
import 'react-awesome-lightbox/build/style.css'

import {FC} from 'react'
import Lightbox from 'react-awesome-lightbox'

export const IMAGES: FC<any> = ({src, showModal, setShowModal, title}) => {
  return (
    <div
      className=''
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      {showModal && (
        <Lightbox
          image={src}
          title={title}
          startIndex={0}
          allowZoom={true}
          allowReset={true}
          allowRotate={true}
          keyboardInteraction={true}
          onClose={() => setShowModal(false)}
        />
      )}

      <style>{`
        .lb-container {
          position: absolute;
        }
        .lb-canvas > img {
          height: 400px;
        }
        .lb-icon-close {
          display: none;
        }
      `}</style>
    </div>
  )
}
