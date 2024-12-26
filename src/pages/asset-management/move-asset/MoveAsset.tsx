import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useState} from 'react'
import {useIntl} from 'react-intl'

import CardMoveAsset from './CardMoveAsset'

let AssetMove: FC = () => {
  const intl: any = useIntl()

  const [reloadMoveAsset, setReloadMoveAsset] = useState<number>(0)

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.ASSET_MANAGEMENT.MOVE'})}
      </PageTitle>
      <CardMoveAsset reloadMoveAsset={reloadMoveAsset} setReloadMoveAsset={setReloadMoveAsset} />
    </>
  )
}

AssetMove = memo(AssetMove, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default AssetMove
