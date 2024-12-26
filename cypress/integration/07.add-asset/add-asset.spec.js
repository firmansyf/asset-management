/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment';
beforeEach(cy.login)

describe('Add Asset', () => {
  beforeEach(() => {
    cy.visit('asset-management/add')
    cy.intercept('**/api/**').as('api')
  })

  it('Add Asset', () => {
    cy.wait('@api')
    cy.get('input[name="description"]').type('desc', {force: true})
    cy.get('input[name="name"]').type('Asset 1', {force: true})
    cy.get('#select-manufacturer').type('{downarrow}', {force: true}).tab()
    cy.get('#select-model').type('{downarrow}', {force: true}).tab()
    cy.get('#select-brand').type('{downarrow}', {force: true}).tab()
    cy.get('#select-supplier').type('{downarrow}', {force: true}).tab()
    cy.get('input[name="serial_no"]').type('123', {force: true})
    cy.get('input[name="qr_code"]').type(moment().format('DDMMYYYYHHmmss'), {force: true})
    // custom field
    // cy.get('input[name="custom_field[1f274442-2b55-4f3d-9d15-9a0f7c5ad818][value][lat]"]').type('34', {force: true}) //lat
    // cy.get('input[name="custom_field[1f274442-2b55-4f3d-9d15-9a0f7c5ad818][value][lng]"]').type('45', {force: true}) //long
    // cy.get('input[name="custom_field[51eb2a82-323f-42e9-b939-3e3ec1ab2b61][value]"]').type(moment().format('DD/MM/YYYY'), {force: true}) //date
    // cy.get('input[name="custom_field[58e2d220-19ae-46dd-bc32-8f6bdf42db32][value]"]').type('test', {force: true}) //test
    // cy.get('input[name="custom_field[8de69532-02d9-4bdb-be04-6b8a2045969f][value]"]').type('test', {force: true}) //text
    // cy.get('input[name="custom_field[b2927e73-c8f1-4ebf-82f7-4f1cf5414202][value]"]').type('AD343', {force: true}) //cust asset id
    // cy.get('input[name="custom_field[c0ab98e2-8a93-4f29-b02e-32b090deed73][value][amount]"]').type('1456', {force: true}) //price
    // cy.get('input[name="custom_field[c533f929-d1ac-4e80-ab20-d6c959a92191][value]"]').check({force: true}) //testing

    cy.get('#select-asset_status').type('{downarrow}', {force: true}).tab()
    cy.get('#select-location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-sub_location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-category').type('{downarrow}', {force: true}).tab()
    cy.get('#select-type').type('{downarrow}', {force: true}).tab()
    // cy.get('#select-company').type('{downarrow}', {force: true}).tab()
    cy.get('#select-department').type('{downarrow}', {force: true}).tab()
    cy.get('#select-user').type('{downarrow}', {force: true}).tab()
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
    cy.get('div').contains('Upload Image').find('input[type="file"]').attachFile('images/profile.png')

    // cy.get('button[type="submit"]').click({force: true})
    // cy.wait('@api')
    // cy.contains('Asset 1').should('exist')
    // cy.get('[data-cy=onClickAssetDelete]').click({force: true})
    // cy.get('.modal-title').contains('Delete').closest('.modal').find('button[type="submit"]').click({force: true})
  })

  // it('Add Asset ( Check Message Custom Field )', () => {
  //   cy.wait('@api')
  //   if( !cy.contains('NO CUSTOM FIELDS ADDED').should('not.exist') ) {
  //     cy.contains('NO CUSTOM FIELDS ADDED').should('not.exist')
  //   }
  // })

  it('Add Asset ( Check Enter Button )', () => {
    cy.wait('@api')    

    cy.get('#select-manufacturer').type('{downarrow}', {force: true}).tab()
    cy.get('#select-model').type('{downarrow}', {force: true}).tab()
    cy.get('#select-brand').type('{downarrow}', {force: true}).tab()
    cy.get('#select-supplier').type('{downarrow}', {force: true}).tab()
    cy.get('#select-asset_status').type('{downarrow}', {force: true}).tab()
    cy.get('#select-location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-sub_location').type('{downarrow}', {force: true}).tab()
    cy.get('#select-category').type('{downarrow}', {force: true}).tab()
    cy.get('#select-type').type('{downarrow}', {force: true}).tab()
    cy.get('#select-company').type('{downarrow}', {force: true}).tab()
    cy.get('#select-department').type('{downarrow}', {force: true}).tab()
    cy.get('input[name="description"]').type('desc', {force: true})
    cy.get('input[name="name"]').type('Asset 1{enter}', {force: true})
  })

  it('Add Asset ( Check Notif Mandatory )', () => {
    cy.wait('@api')
    cy.get('button[type="submit"]').click({force: true})
    cy.wait(1000)
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })

  it('Add Asset ( Check Country )', () => {
    cy.wait('@api')

    cy.wait(3000)    
    cy.get(':nth-child(2) > :nth-child(6) > .input-group > [data-cy=add-input-btn]').click({force: true})
    cy.contains('Choose Country').should('not.exist')
  })
})

describe('Database Integration (Required Fields)', () => {
  beforeEach(() => {
    cy.visit('asset-management/add')
    cy.intercept('**/setting/database/asset', (req) => {
      req.continue((res) => {
        let {body: {data}} = res
        res.body.data = data.map(m => {
          const modefied = {...m, is_selected: true, is_required: true}
          return modefied
        })
        res.send(res)
      })
    }).as('getDatabaseAsset')
  })

  afterEach(() => cy.wait(5000))

  it('Asset Name', () => {
    cy.get('@getDatabaseAsset').then(() => {
      cy.get('label[for="asset_name"]').should('have.class', 'required')
    })
  })

  it('Asset Status', () => {
    cy.get('@getDatabaseAsset').then(() => {
      cy.get('label[for="asset_status"]').should('have.class', 'required')
    })
  })
})

describe('Database Integration (Selected Fields)', () => {
  beforeEach(() => {
    cy.visit('asset-management/add')
    cy.intercept('**/setting/database/asset', (req) => {
      req.continue((res) => {
        let {body: {data}} = res
        res.body.data = data.map(m => {
          const modefied = {...m, is_selected: true, is_required: true}
          return modefied
        })
        res.send(res)
      })
    }).as('getDatabaseAsset')
  })

  afterEach(() => cy.wait(5000))

  it('Asset Name', () => {
    cy.get('@getDatabaseAsset').then(() => {
      cy.get('label[for="asset_name"]').should('be.visible')
    })
  })

  it('Asset Status', () => {
    cy.get('@getDatabaseAsset').then(() => {
      cy.get('label[for="asset_status"]').should('be.visible')
    })
  })
})
