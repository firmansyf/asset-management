/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment';
beforeEach(cy.login)

describe('Edit Asset', () => {
  beforeEach(() => {
    cy.visit('asset-management/edit?id=17fcc7bb-9073-4a6a-b3d0-e873ed29822e')
    cy.intercept('**/api/v1/setting/manufacturer/filter*').as('getManufacturer')
    cy.intercept('**/api/v1/setting/manufacturer/model/filter*').as('getModel')
    cy.intercept('**/api/v1/setting/manufacturer/brand/filter*').as('getBrand')
    cy.intercept('**/api/**').as('api')
  })

  afterEach(() => cy.wait(8000))

  it('Edit Asset', () => {
    cy.wait('@api')
    cy.get('input[name="description"]').type('desc', {force: true})
    cy.get('input[name="name"]').type('Asset 1', {force: true})
    cy.get('#select-manufacturer').type('{downarrow}', {force: true}).tab()
    cy.get('#select-model').type('{downarrow}', {force: true}).tab()
    cy.get('#select-brand').type('{downarrow}', {force: true}).tab()
    cy.get('#select-supplier').type('{downarrow}', {force: true}).tab()
    cy.get('input[name="serial_no"]').type('123', {force: true})
    cy.get('input[name="qr_code"]').type('123', {force: true})
    cy.get('#select-asset_status').type('{downarrow}', {force: true}).tab()
    cy.get('#select-location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-sub_location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-category').type('{downarrow}', {force: true}).tab()
    cy.get('#select-type').type('{downarrow}', {force: true}).tab()
    cy.get('#select-company').type('{downarrow}', {force: true}).tab()
    cy.get('#select-department').type('{downarrow}', {force: true}).tab()

    // if( !cy.get('#select-user').should('not.exist') ) {
    //   cy.get('#select-user').type('{downarrow}', {force: true}).tab()
    // }

    cy.get('button[data-bs-target="#financialInfo"]').click({force: true})
    cy.get('input[name="purchase_order_number"]').type('123', {force: true})
    cy.get('input[name="purchase_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    cy.get('input[name="unit_cost"]').type('123', {force: true})
    cy.get('input[name="total_quantity"]').type('10', {force: true})
    cy.get('input[name="delivery_order_number"]').type('123', {force: true})
    cy.get('input[name="invoice_number"]').type('123', {force: true})
    cy.get('input[name="delivery_order_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    cy.get('input[name="invoice_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    cy.get('input[name="actual_date_received"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    cy.get('input[name="cheque_number"]').type('123', {force: true})
    cy.get('input[name="cheque_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    cy.get('input[name="voucher_number"]').type('123', {force: true})
    cy.get('input[name="voucher_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('div').contains('Upload Image').find('input[type="file"]').attachFile('images/profile.png')

    cy.get('button[type="submit"]').click({force: true})
    // cy.wait('@api')
    // cy.get('.card-title').should('contain', 'Asset Information')
    // cy.get('.bg-light-danger.border.border-dashed.border-danger.shadow-sm').click({force: true})
    // cy.get('.modal-title').contains('Delete').closest('.modal').find('button[type="submit"]').click({force: true})
  })
})
