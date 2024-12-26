/* eslint-disable cypress/no-unnecessary-waiting */

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

    // cy.get('.select_manufacturer_cypress').click({force:true})
    // cy.contains('').click({force:true})

    // cy.get('#select-model').type('{downarrow}').tab()
    // cy.get('#select-brand').type('{downarrow}').tab()
    // cy.get('#select-supplier').type('{downarrow}').tab()

    cy.get('input[name="serial_no"]').type('123', {force: true})
    cy.get('input[name="qr_code"]').type('123', {force: true})

    cy.get('.select_asset_status_cypress')
      .click({force:true})
      .find('input#select-asset_status')
      .type('Lost{enter}', {force: true})

    // cy.get('#select-location').type('{downarrow}').tab()
    // cy.get('#select-sub_location').type('{downarrow}').tab()
    // cy.get('#select-type').type('{downarrow}').tab()

    cy.get('.select_category_cypress')
      .click({force: true})
      .find('input#select-category')
      .type('Computer{enter}', {force: true})

    cy.get('.select_company_cypress')
      .click({force: true})
      .find('input#select-company')
      .type('AD-Stag{enter}', {force: true})

    // cy.get('#select-department').type('{downarrow}').tab()
    // cy.get('#select-user').type('{downarrow}').tab()

    // cy.get('button[data-bs-target="#financialInfo"]').click({force: true})
    // cy.get('input[name="purchase_order_number"]').type('123', {force: true})
    // cy.get('input[name="purchase_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('input[name="unit_cost"]').type('123', {force: true})
    // cy.get('input[name="total_quantity"]').type('10', {force: true})
    // cy.get('input[name="delivery_order_number"]').type('123', {force: true})
    // cy.get('input[name="invoice_number"]').type('123', {force: true})
    // cy.get('input[name="delivery_order_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('input[name="invoice_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('input[name="actual_date_received"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('input[name="cheque_number"]').type('123', {force: true})
    // cy.get('input[name="cheque_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('input[name="voucher_number"]').type('123', {force: true})
    // cy.get('input[name="voucher_date"]').type(moment().format('DD/MM/YYYY'), {force: true}).blur()
    // cy.get('div').contains('Upload Image').find('input[type="file"]').attachFile('images/profile.png')

    // cy.get('button[type="submit"]').click({force: true})
    // cy.wait('@api')
    // cy.url().should('contain', 'asset-management/detail')
    // cy.get('div[data-bs-toggle="tooltip"][title="Delete"]').click()
    // cy.get('.modal-title').contains('Delete').closest('.modal').find('button[type="submit"]').click({force: true})
  })

  it.only('Add Asset ( Check Notif Mandatory )', () => {
    cy.wait('@api')
    cy.get('button[type="submit"]').click({force: true})
    cy.wait(1000)
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })

  it('Add Asset ( Check Message Custom Field )', () => {
    cy.wait('@api')
    if( !cy.contains('NO CUSTOM FIELDS ADDED').should('not.exist') ) {
      cy.contains('NO CUSTOM FIELDS ADDED').should('not.exist')
    }
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

describe('Case by Tickets', () => {
  beforeEach(() => {
    cy.visit('asset-management/add')
    cy.intercept('**/api/**').as('api')
  })

  it('FE-2262 Remove description text', () => {
    cy.wait('@api')
    cy.get('[data-cy="upload-container"]').first().contains('Drag a file here').should('have.length.lessThan', 2)
  })

  it('FE-2232 Font size in asset files', () => {
    cy.wait('@api')
    cy.get('[data-cy="upload-container"]:first').contains(/drag a file/gi).should('not.have.class', /fs-/gi)
  })

  it('FE-2204 Custom fields and financial info improvement', () => {
    cy.wait('@api')
    cy.get('[data-cy="financial-info"]').closest('.accordion').should('have.class', 'accordion-fit-content')
  })

  it('FE-2219 [DATE FORMAT] Date format should follow based on Profile ', () => {
    cy.get('.accordion-button').click({force: true})
    cy.get(':nth-child(2) > .input-group > .rdt > .form-control').should('be.visible')
    cy.get(':nth-child(8) > .input-group > .rdt > .form-control').should('be.visible')
    cy.get(':nth-child(9) > .input-group > .rdt > .form-control').should('be.visible')
    cy.get(':nth-child(10) > .input-group > .rdt > .form-control').should('be.visible')
    cy.get(':nth-child(12) > .input-group > .rdt > .form-control').should('be.visible')
    cy.get(':nth-child(14) > .input-group > .rdt > .form-control').should('be.visible')
  })
})

