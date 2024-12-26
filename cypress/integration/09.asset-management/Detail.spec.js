/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Asset Detail', () => {
  beforeEach(() => {
    cy.visit('asset-management/detail/0bbd76d5-00cd-4241-81dc-4af26dab8631')
    cy.intercept('**/api/v1/**').as('getDetailAsset')
    cy.wait('@getDetailAsset')
  
    // cy.visit('asset-management/all')
    // cy.intercept('**/report/asset*', {fixture: 'asset-management/getAsset'}).as('getAsset')
    // cy.wait('@getAsset')
    // cy.get('[data-cy=viewTable]:first').click({force: true})
  })

  it('Check Out/In History', () => {
    cy.get('[data-cy=CheckinCheckoutHistory]').click({force : true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    // cy.get('[data-cy=dueDateCheckinOutHistory]').should('contain', 'Due Date')
  })


  it('Check Out/In', () => {
    cy.wait(3000)
    if( cy.get('[data-cy=btnCheckout]').should('exist') ) {
      cy.get('[data-cy=btnCheckout]').click({force : true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')  

      cy.wait(3000)
      cy.get('select[name="type"]').select('Employee', {force: true})
      cy.get('select[name="employee_guid"]').select('test_employee', {force: true})
      cy.get(':nth-child(1) > .input-group > .rdt > .form-control').click({force: true})
      cy.get(':nth-child(1) > .input-group > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(3) > [data-value="18"]').click({force: true})
      cy.get('#sendEmail-0').click({force: true})
      cy.get('.modal-footer > .btn-primary').click({force: true})
    }
  })

  // it('FE-1311 [ASSET] Blank screen on add cf currency', () => {
    // cy.intercept('**/api/v1/asset/**', {fixture: 'asset-management/getAssetDetail'}).as('getAssetDetail')
    // cy.wait('@getAssetDetail')
    // cy.get('#kt_content').should('be.visible')
  // })

  it('Check Asset Name', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Name')
    cy.get('.text-dark').should('contain', 'Procom Coupler')
  })

  it('Check Asset Desc', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Description')
    cy.get('.text-dark').should('contain', '04 Des 2021 -User ask for check and fault found and keep in store.Replace with SN: 88000000A050703D.')
  })

  it('Check Manufacturer', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Manufacturer')
    // cy.get('.text-dark').should('contain', 'Man ir')
  })

  it('Check Model', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Model')
    // cy.get('.text-dark').should('contain', 'Mod ir')
  })

  it('Check Brand', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Brand')
    // cy.get('.text-dark').should('contain', 'Brand ir')
  })

  it('Check Supplier', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Supplier')
    cy.get('.text-dark').should('contain', 'Sepura Austria')
  })

  it('Check Asset Status', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Status')
    cy.get('.text-dark').should('contain', 'Disposed')
  })

  it('Check QR Code', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'QR Code')
    cy.get('.text-dark').should('contain', '93FF4E95')
  })

  it('Check Serial Number', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Serial Number')
    // cy.get('.text-dark').should('contain', '145431117')
  })

  it('Check Customer Asset Id', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Serial Number')
    cy.get('.text-dark').should('contain', 'CSR-0126')
  })

  // it('Check Comment', () => {
  //   cy.get('.fw-bolder.text-dark').should('contain', 'Status Comment')
  //   cy.get('.text-dark').should('contain', 'Teu Gaduh')
  // })

  it('Email asset', () => {
    cy.get('.bg-light-danger.border.border-dashed.border-danger.shadow-sm').should('be.visible').click({force: true})
  })

  it('FE-2212 Add checkout date in view asset', () => {
    cy.intercept('**/api/v1/asset/**').as('getAssetDetail')
    cy.wait('@getAssetDetail')
    cy.get('[data-cy=card-check-in-out]').should('contain', 'Checkout Date')
  })
})

// describe('Financial Tab', () => {
//   beforeEach(() => {
//     cy.visit('asset-management')
//     cy.get('[data-cy=viewTable]').first().click({force:true})
//     cy.wait(5000)
//   })

//   it('Check Financial Tab', () => {
//     cy.get('[data-cy="tabFinancial"]').should('contain', 'Financial').click({force: true})
//     cy.get('[data-cy="financialTitle1"]').should('contain', 'Purchase Order Number').click({force: true})
//     cy.get('[data-cy="financialTitle2"]').should('contain', 'Purchase Date').click({force: true})
//     cy.get('[data-cy="financialTitle3"]').should('contain', 'Cost Per Unit').click({force: true})
//     cy.get('[data-cy="financialTitle4"]').should('contain', 'Total Quantity').click({force: true})
//     cy.get('[data-cy="financialTitle5"]').should('contain', 'Total Cost').click({force: true})
//     cy.get('[data-cy="financialTitle6"]').should('contain', 'Delivery Order Number').click({force: true})
//     cy.get('[data-cy="financialTitle7"]').should('contain', 'Invoice Number').click({force: true})
//     cy.get('[data-cy="financialTitle8"]').should('contain', 'Delivery Order Date').click({force: true})
//     cy.get('[data-cy="financialTitle9"]').should('contain', 'Invoice Date').click({force: true})
//     cy.get('[data-cy="financialTitle10"]').should('contain', 'Actual Date Received').click({force: true})
//     cy.get('[data-cy="financialTitle11"]').should('contain', 'Cheque / Payment Reference Number').click({force: true})
//     cy.get('[data-cy="financialTitle12"]').should('contain', 'Cheque / Payment Reference Date').click({force: true})
//     cy.get('[data-cy="financialTitle13"]').should('contain', 'Voucher Number').click({force: true})
//     cy.get('[data-cy="financialTitle14"]').should('contain', 'Voucher Date').click({force: true})
//   })
// })

// describe('Asset Detail2', () => {
//   beforeEach(() => {
//     cy.visit('asset-management/all')
//     cy.intercept('**/api/v1/**').as('getAsset')
//   })

//   it('Print asset', () => {
//     cy.wait('@getAsset')
//     cy.get('[data-cy=viewTable]:first').click({force: true})
//     cy.contains('Details').should('exist')
//     cy.get('.bg-light-primary.border.border-dashed.border-primary.shadow-sm').should('be.visible')
//   })

//   it('[ Details Asset ] Email Asset', () => {
//     cy.intercept('**/api/v1/asset/**').as('api')
    
//     cy.wait('@getAsset')
//     cy.get('[data-cy=viewTable]:first').click({force: true})
//     cy.contains('Details').should('exist')
  
//     cy.wait('@api')
//     cy.wait(3000)
//     cy.get('[data-cy=onClickAssetEmail]').click({force: true})
//     cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
//     cy.get('div.modal').find('div.modal-header').should('contain', 'Email Asset')

//     cy.wait(3000)
//     cy.get('.modal-footer > .btn-primary').click({ force: true })
//     cy.contains('Please select at least one recipient').should('exist')

//     cy.wait(3000)
//     cy.get(':nth-child(2) > .form-check-input').click({force:true})
//     cy.get(':nth-child(3) > .form-check-input').click({force:true})
//     cy.get(':nth-child(4) > .form-check-input').click({force:true})
//     cy.contains('Choose Team').click({force:true})
//     cy.get(':nth-child(2) > .form-check-input').click({force:true})

//     cy.contains('Choose User').click({force:true})
//     cy.get(':nth-child(3) > .form-check-input').click({force:true})
    
//     cy.get('.react-tags__search-input').type('testingaccount@mailinator.com{enter}', {force: true})
//     cy.get('.modal-body > :nth-child(2) > .form-control').type('Test', {force: true})
//     cy.get('#include_file').click({ force: true })
//     cy.get('.modal-footer > .btn-primary').click({ force: true })
//   })

//   it('[ Details Asset ] Check Data Financial', () => {
//     cy.intercept('**/api/v1/asset/**').as('api')
//     cy.wait('@api')
//     cy.get('[data-cy=addAsset]').click({force:true})
//     cy.get('input[name="description"]').type('desc', {force: true})
//     cy.get('input[name="name"]').type('Asset 1', {force: true})
//     cy.get('#select-manufacturer').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-model').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-brand').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-supplier').type('{downarrow}', {force: true}).tab()
//     cy.get('input[name="serial_no"]').type('123', {force: true})
//     cy.get('#select-asset_status').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-location').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-sub_location').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-category').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-type').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-company').type('{downarrow}', {force: true}).tab()
//     cy.get('#select-department').type('{downarrow}', {force: true}).tab()
//     cy.get('.card-footer > .btn-primary').click({force:true})

//     cy.wait(3000)
//     cy.get(':nth-child(3) > .m-0').click({force: true})
//   })
// })


describe('Asset History', () => {
  beforeEach(() => {
    cy.visit('asset-management/detail/cf39d30f-0c6e-49f5-82e5-7077b62abb90#asset-history')
    cy.intercept('**/api/v1/**').as('getDetailAsset')
    cy.wait(6000)
  })

  it('Asset Edit', () => {
    cy.contains('Asset Information').should('exist')
    cy.contains('All Event').should('exist')

    cy.get('[data-cy=select-event-history]').should('exist')
    cy.get('[data-cy=select-event-history]').select('Asset Edit', {force: true})

    cy.wait(2000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get("[data-cy=viewTable]").first().click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.contains('Asset Edit').should('exist')
    cy.contains('Field Name').should('exist')
    cy.contains('Changed From').should('exist')
    cy.contains('Changed To').should('exist')
  })
})