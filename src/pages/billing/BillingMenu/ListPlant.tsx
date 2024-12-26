import {Alert} from '@components/alert'
import clsx from 'clsx'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'

import {getOwnerSubscription, getPlan} from '../Service'
import {planDescription} from './PlanDescription'

const ListPlan: FC<any> = ({setOwnerSubscription, ownerSubscription, setEndTrial}) => {
  const [dataPlan, setDataPlan] = useState([])
  const [uniqueId, setUniqueID] = useState('free')
  const [currency, setCurrency] = useState('USD')
  const [totalAsset, setTotalAsset] = useState(500)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [billingCycleTitle, setBillingCycleTitle] = useState('month')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [defaultGroup, setDefaultGroup] = useState(3)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [defaultUniqueID, setDefaultUniqueID] = useState('')
  const [defaultName, setDefaultName] = useState('')
  const [selectedName, setSelectedName] = useState('')

  const navigate = useNavigate()

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

  const onClickPlan = (unique_id: any, plan: any, price: any, name: any) => {
    setLoading(false)
    setShowModal(true)
    setSelectedPlan(plan)
    setUniqueID(unique_id)
    setTotalPrice(price)
    setSelectedName(name)
  }

  const sendPlan = () => {
    navigate(
      `/billing/confirm-form/?package=${selectedPlan}&currency=${currency}&totalAsset=${totalAsset}&price=${totalPrice}&PaymentCycle=${billingCycle}&uniqueId=${uniqueId}&change=true`
    )
  }

  const msg_alert = [
    `Are you sure to change plan from`,
    <br key='br1' />,
    <strong key='default_plan'>{ownerSubscription}</strong>,
    ' to ',
    <strong key='selected_plan'>{selectedPlan} ?</strong>,
  ]

  const msg_alert_update_asset = [
    `Are you sure to change plan from`,
    <br key='br2' />,
    <strong key='default_plan'>{defaultName}</strong>,
    ' to ',
    <strong key='selected_plan'>{selectedName} ?</strong>,
  ]

  useEffect(() => {
    // defaultGroup 3 => Standar
    // defaultGroup 4 => Professional
    // defaultGroup 5 => Advance

    getOwnerSubscription()
      .then(({data: {data: res}}) => {
        if (res) {
          setCurrency(res?.plan?.currency)
          setTotalAsset(res?.plan?.limit_asset >= 500 ? res?.plan?.limit_asset : 500)
          setBillingCycle(res?.plan?.billing_cycle)
          setDefaultUniqueID(res?.plan?.unique_id)
          setDefaultName(res?.plan?.name)
          setEndTrial(res?.subscription?.trial_ends_at || moment().format('YYYY-MM-DD'))

          if (res?.plan?.plan_group === 5) {
            setOwnerSubscription('Advance')
          } else if (res?.plan?.plan_group === 4) {
            setOwnerSubscription('Professional')
          } else {
            setOwnerSubscription('Standard')
          }

          if (res?.plan?.plan_group === 1) {
            setDefaultGroup(3)
          } else {
            setDefaultGroup(res?.plan?.plan_group)
          }
          if (res?.plan?.billing_cycle === 'yearly') {
            setBillingCycleTitle('year')
          } else {
            setBillingCycleTitle('month')
          }
        }
      })
      .catch(() => '')
  }, [setOwnerSubscription, setEndTrial])

  useEffect(() => {
    if (currency && totalAsset && billingCycle) {
      getPlan({currency, totalAsset, billingCycle})
        .then(({data: {data: res}}) => {
          if (res) {
            const planGrup = [3, 4, 5]
            const dataPlan = filter(res, (data_plan: any) =>
              includes(planGrup, data_plan?.plan_group)
            )
            setDataPlan(orderBy(dataPlan, 'plan_group', 'asc') as never)
          }
        })
        .catch(() => '')
    }
  }, [currency, totalAsset, billingCycle])

  return (
    <>
      <div className='text-center'>
        <div className='billing-cycle'>
          <button
            className={clsx(
              billingCycle === 'monthly' ? 'btn-primary' : 'btn-secondary',
              'btn text-uppercase'
            )}
            onClick={billingMonthly}
          >
            Monthly
          </button>
          <button
            className={clsx(
              billingCycle === 'yearly' ? 'btn-primary' : 'btn-secondary',
              'btn text-uppercase'
            )}
            onClick={billingYearly}
          >
            Yearly
          </button>
        </div>
        <div className='billing-number input-group number-of-asset'>
          <span className='title-asset-text'>Number of Assets </span>
          <button
            className='h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center'
            type='submit'
            onClick={onChangeMinusAsset}
            style={{marginTop: 8, marginRight: 2}}
          >
            <i className='fas fa-minus text-white' />
          </button>
          <input
            type='text'
            step='500'
            max='15000'
            value={totalAsset}
            defaultValue='500'
            className='quantity-field'
          />
          <button
            className='h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center'
            type='submit'
            onClick={onChangePlusAsset}
            style={{marginTop: 8}}
          >
            <i className='fas fa-plus text-white' />
          </button>
        </div>
      </div>
      <section className='pricing py-5'>
        <div className='container'>
          <div className='row'>
            {dataPlan.length === 3 &&
              dataPlan?.map(
                (
                  {unique_id, name, currency, price, limit_asset, plan_group, description}: any,
                  key: any
                ) => {
                  const detail_plan: any = planDescription?.find(
                    (obj: any) => obj?.plan_group === plan_group
                  )
                  return (
                    <div className='col-lg-4 mb-6' key={key}>
                      <div className='card'>
                        <div className='card-body'>
                          <h5 className='card-title text-muted text-uppercase text-center'>
                            {name}
                          </h5>
                          <h6 className='card-price text-center'>
                            {currency} {price}
                            <span className='period'>/{billingCycleTitle}</span>
                          </h6>
                          <h6 className='card-title-sub text-center'>
                            Up to {limit_asset} Asset, Unlimited Users
                          </h6>
                          <div className='d-grid price-button'>
                            {defaultGroup === plan_group &&
                              (defaultUniqueID === unique_id ? (
                                <Link
                                  to={`/billing/confirm-form/?package=${detail_plan.name}&totalAsset=${totalAsset}&currency=${currency}&PaymentCycle=${billingCycle}&price=${price}&uniqueId=${unique_id}`}
                                  className='btn btn-success text-uppercase'
                                >
                                  Select This Plan
                                </Link>
                              ) : (
                                <Button
                                  className='btn btn-primary text-uppercase'
                                  onClick={() =>
                                    onClickPlan(unique_id, detail_plan.name, price, name)
                                  }
                                >
                                  Select This Plan
                                </Button>
                              ))}
                            {defaultGroup !== plan_group && (
                              <Button
                                className='btn btn-primary text-uppercase'
                                onClick={() =>
                                  onClickPlan(unique_id, detail_plan.name, price, name)
                                }
                              >
                                Select This Plan
                              </Button>
                            )}
                          </div>
                          <hr />
                          <div className='core-features'>
                            <strong>{description} :</strong>
                          </div>
                          <ul className='fa-ul'>
                            {detail_plan &&
                              detail_plan.feature_lists?.map(({title, feature}: any, key: any) => {
                                return (
                                  <li key={key}>
                                    {feature === 'yes' && (
                                      <>
                                        <span className='fa-li'>
                                          <i className='fas fa-check text-success'></i>
                                        </span>
                                        {title}
                                      </>
                                    )}

                                    {feature === 'no' && (
                                      <>
                                        <span className='fa-li'>
                                          <i className='fas fa-times text-light-gray'></i>
                                        </span>
                                        <span className='text-light-gray'>{title}</span>
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

      <Alert
        setShowModal={setShowModal}
        showModal={showModal}
        loading={loading}
        body={ownerSubscription !== selectedPlan ? msg_alert : msg_alert_update_asset}
        type={'condfirm'}
        title={`Change Plan`}
        confirmLabel={'Confirm'}
        onConfirm={() => {
          sendPlan()
          setShowModal(false)
        }}
        onCancel={() => {
          setShowModal(false)
        }}
      />
    </>
  )
}

export {ListPlan}
