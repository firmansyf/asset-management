import {FC} from 'react'

type AssetFormProps = {
  [key: string]: any
}

const AssetForm: FC<AssetFormProps> = () => {
  return (
    <div className='row mt-5 pt-3 mb-3'>
      <div className='col-12'>
        <p>Form Attach Asset</p>
      </div>
    </div>
  )
}

export {AssetForm}
