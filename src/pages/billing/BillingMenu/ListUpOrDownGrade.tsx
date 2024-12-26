import clsx from 'clsx'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

import {getPaymentContact} from '../ConfirmationPlanForm/Service'
import {getOwnerSubscription, getPlan} from '../Service'
import {ConfirmUpgradeDowngrade} from './ConfirmUpgradeDowngrade'
import {planDescription} from './PlanDescription'

const ListUpOrDownGrade: FC<any> = ({
  ownerSubscription,
  setOwnerSubscription,
  defaultPlan,
  setDefaultPlan,
  country,
  setCountry,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {country: dataCountry} = preferenceStore || {}

  const [dataPlan, setDataPlan] = useState<any>([])
  const [currency, setCurrency] = useState<string>('USD')
  const [dataContact, setDataContact] = useState<any>({})
  const [totalAsset, setTotalAsset] = useState<number>(500)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [defaultName, setDefaultName] = useState<string>('')
  const [defaultGroup, setDefaultGroup] = useState<number>(3)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [changeStatus, setChangeStatus] = useState<string>('')
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedGroup, setSelectedGroup] = useState<number>(0)
  const [defaultUniqueID, setDefaultUniqueID] = useState<string>('')
  const [billingCycle, setBillingCycle] = useState<string>('monthly')
  const [selectedUniqueID, setSelectedUniqueID] = useState<string>('')
  const [changeStatusText, setChangeStatusText] = useState<string>('')
  const [defaultLimitAsset, setDefaultLimitAsset] = useState<number>(0)
  const [billingCycleTitle, setBillingCycleTitle] = useState<string>('month')

  const billingMonthly = () => {
    setBillingCycle('monthly')
    setBillingCycleTitle('month')
  }

  const billingYearly = () => {
    setBillingCycle('yearly')
    setBillingCycleTitle('year')
  }

  const onChangeMinusAsset = () => {
    if (totalAsset > 500) {
      setTotalAsset(totalAsset < 11000 ? totalAsset - 500 : totalAsset - 1000)
    }
  }

  const onChangePlusAsset = () => {
    if (totalAsset < 15000) {
      setTotalAsset(totalAsset < 10000 ? totalAsset + 500 : totalAsset + 1000)
    }
  }

  const onClickPlan = (plan: any, name: any, plan_group: number, select_uniq_id: any) => {
    setShowModal(true)
    // setLoading(false)
    setSelectedPlan(plan)
    setSelectedName(name)
    setSelectedGroup(plan_group)
    setSelectedUniqueID(select_uniq_id)

    if (defaultGroup > plan_group) {
      // downgrade
      setChangeStatus('Downgrade')
      setChangeStatusText('You will permanently loose the features listed : ')
    }

    if (defaultGroup < plan_group) {
      // upgrade
      setChangeStatus('Upgrade')
      setChangeStatusText('You will have the features listed : ')
    }

    if (defaultGroup === plan_group) {
      // downgrade or upgrade on same goup plan
      if (defaultLimitAsset > totalAsset) {
        setChangeStatus('Downgrade')
        setChangeStatusText('You will permanently loose the features listed : ')
      } else {
        setChangeStatus('Upgrade')
        setChangeStatusText('You will have the features listed : ')
      }
    }
  }

  useEffect(() => {
    // defaultGroup 1 => Free
    // defaultGroup 3 => Standar
    // defaultGroup 4 => Professional
    // defaultGroup 5 => Advance

    getOwnerSubscription().then(({data: {data: res}}) => {
      if (res) {
        setOwnerSubscription(res || {})
        setDefaultName(res?.plan?.name || '')
        setCurrency(res?.plan?.currency || '')
        setDefaultUniqueID(res?.plan?.unique_id || '')
        setBillingCycle(res?.plan?.billing_cycle || '')
        setDefaultLimitAsset(res?.plan?.limit_asset || '')
        setDefaultGroup(res?.plan?.plan_group === 1 ? 3 : res?.plan?.plan_group)
        setTotalAsset(res?.plan?.limit_asset >= 500 ? res?.plan?.limit_asset : 500)

        if (res?.plan?.billing_cycle === 'yearly') {
          setBillingCycleTitle('year')
        } else {
          setBillingCycleTitle('month')
        }
      }
    })
  }, [setOwnerSubscription])

  useEffect(() => {
    if (ownerSubscription?.plan?.plan_group === 1) {
      setDefaultPlan('Free')
    } else if (ownerSubscription?.plan?.plan_group === 5) {
      setDefaultPlan('Advance')
    } else if (ownerSubscription?.plan?.plan_group === 4) {
      setDefaultPlan('Professional')
    } else if (ownerSubscription?.plan?.plan_group === 3) {
      setDefaultPlan('Standard')
    } else {
      setDefaultPlan('')
    }
  }, [ownerSubscription?.plan?.plan_group, setDefaultPlan])

  useEffect(() => {
    currency &&
      totalAsset &&
      billingCycle &&
      getPlan({currency, totalAsset, billingCycle}).then(({data: {data: res}}: any) => {
        if (res) {
          const planGrup: any = [3, 4, 5]
          const dataPlan: any = filter(res, (data_plan: any) =>
            includes(planGrup, data_plan?.plan_group)
          )
          setDataPlan(orderBy(dataPlan, 'plan_group', 'asc') as never)
        }
      })
  }, [currency, totalAsset, billingCycle])

  useEffect(() => {
    getPaymentContact().then(({data: res}: any) => {
      res && setDataContact(res)
    })
  }, [])

  useEffect(() => {
    if (dataContact !== undefined) {
      const countryData: any = dataContact?.billing_detail?.address?.country || 'USD'

      if (dataCountry && countryData) {
        const resCountry: any = dataCountry?.find(
          ({name}: any) => name?.toLowerCase() === countryData?.toLowerCase()
        )
        setCountry(resCountry?.currencies?.[0] || '')
      }
    }
  }, [dataContact, dataCountry, setCountry])
  return (
    <>
      <div className='text-center'>
        <div className='billing-cycle'>
          <button
            data-cy='monthlyButton'
            onClick={billingMonthly}
            className={clsx(
              billingCycle === 'monthly' ? 'btn-primary' : 'btn-secondary',
              'btn text-uppercase'
            )}
          >
            Monthly
          </button>

          <button
            data-cy='yearlyButton'
            onClick={billingYearly}
            className={clsx(
              billingCycle === 'yearly' ? 'btn-primary' : 'btn-secondary',
              'btn text-uppercase'
            )}
          >
            Yearly
          </button>
        </div>

        <div className='billing-number input-group number-of-asset'>
          <span className='title-asset-text'>Number of Assets </span>
          <button
            type='submit'
            onClick={onChangeMinusAsset}
            className='h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center'
            style={{marginTop: 8, marginRight: 2}}
          >
            <i className='fas fa-minus text-white' />
          </button>

          <input
            type='text'
            step='500'
            max='15000'
            value={totalAsset || 0}
            defaultValue='500'
            className='quantity-field'
          />

          <button
            type='submit'
            style={{marginTop: 8}}
            onClick={onChangePlusAsset}
            className='h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center'
          >
            <i className='fas fa-plus text-white' />
          </button>
        </div>
      </div>

      <section className='pricing py-5'>
        <div className='container'>
          <div className='row'>
            {dataPlan &&
              dataPlan?.length > 0 &&
              dataPlan?.map(
                (
                  {unique_id, name, currency, price, limit_asset, plan_group, description}: any,
                  key: any
                ) => {
                  const detail_plan: any = planDescription?.find(
                    (obj: any) => obj?.plan_group === plan_group
                  )

                  return (
                    <div className='col-lg-4 mb-6' key={key || 0}>
                      <div className='card'>
                        <div className='card-body'>
                          <h5 className='card-title text-muted text-uppercase text-center'>
                            {detail_plan?.name || ''}
                          </h5>
                          <h6 className='card-price text-center'>
                            {country || currency || ''} {price || ''}
                            <span className='period'>/{billingCycleTitle || ''}</span>
                          </h6>
                          <h6 className='card-title-sub text-center'>
                            Up to {limit_asset || 0} Asset, Unlimited Users
                          </h6>
                          <div className='d-grid price-button'>
                            {defaultGroup === plan_group &&
                              (defaultUniqueID === unique_id ? (
                                <h3 className='text-success'>Current Plan</h3>
                              ) : (
                                <Button
                                  className='btn btn-primary text-uppercase'
                                  data-cy={`select${detail_plan?.name || ''}`}
                                  onClick={() =>
                                    onClickPlan(detail_plan?.name, name, plan_group, unique_id)
                                  }
                                >
                                  Select This Plan
                                </Button>
                              ))}

                            {defaultGroup !== plan_group && (
                              <Button
                                className='btn btn-primary text-uppercase'
                                data-cy={`select${detail_plan?.name || ''}`}
                                onClick={() =>
                                  onClickPlan(detail_plan?.name, name, plan_group, unique_id)
                                }
                              >
                                Select This Plan
                              </Button>
                            )}
                          </div>
                          <hr />

                          <div className='core-features'>
                            <strong>{description || ''} :</strong>
                          </div>

                          <ul className='fa-ul'>
                            {detail_plan &&
                              detail_plan?.feature_lists &&
                              detail_plan?.feature_lists?.length > 0 &&
                              detail_plan?.feature_lists?.map(({title, feature}: any, key: any) => {
                                return (
                                  <li key={key || 0}>
                                    {feature === 'yes' && (
                                      <>
                                        <span className='fa-li'>
                                          <i className='fas fa-check text-success'></i>
                                        </span>
                                        {title || '-'}
                                      </>
                                    )}

                                    {feature === 'no' && (
                                      <>
                                        <span className='fa-li'>
                                          <i className='fas fa-times text-light-gray'></i>
                                        </span>
                                        <span className='text-light-gray'>{title || '-'}</span>
                                      </>
                                    )}
                                  </li>
                                )
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
          </div>
        </div>
      </section>

      <ConfirmUpgradeDowngrade
        showModal={showModal}
        defaultPlan={defaultPlan}
        defaultName={defaultName}
        selectedName={selectedName}
        setShowModal={setShowModal}
        changeStatus={changeStatus}
        selectedPlan={selectedPlan}
        defaultGroup={defaultGroup}
        selectedGroup={selectedGroup}
        changeStatusText={changeStatusText}
        selectedUniqueID={selectedUniqueID}
      />
    </>
  )
}

export {ListUpOrDownGrade}
