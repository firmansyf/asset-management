/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Detail Inventory', () => {
  beforeEach( () => {
    cy.visit('inventory')
    cy.intercept('**/inventory*').as('getInventory')
    cy.wait(3000)
  })
  it('Data Table Inventory', () => {
    cy.wait('@getInventory')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })
  it('FE-1365 [INVENTORY] Bugs on Inventory Details', () => {
    cy.wait('@getInventory')
    cy.get('table > tbody > tr:first > td').find('svg').closest('a').click({force: true})
    cy.intercept('**/inventory/**').as('getInventoryRoute')
    cy.wait('@getInventoryRoute').its('response.statusCode').should('eq', 200)
  })
  it('Check Reservation Page', () => {
    cy.wait('@getInventory')
    cy.get('table > tbody > tr:first > td').find('svg').closest('a').click({force: true})
    cy.intercept('**/inventory/**').as('getInventoryRoute')
    cy.wait('@getInventoryRoute').its('response.statusCode').should('eq', 200)
    cy.get('.nav-link').contains('Reservation').click({force: true})
  })
  it.only('Check Detail Page', () => {
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get("[data-cy=viewTable]").first().click({force: true})
    cy.wait(3000)
    cy.contains('INVENTORY ID').should('exist')
    cy.contains('ABC00001').should('exist')
    cy.contains('Inventory Detail').should('exist')
    cy.contains('Inventory Information').should('exist')

    cy.contains('Default Location').should('exist')
    cy.contains('Okky').should('exist')

    cy.contains('Total Quantity').should('exist')
    
    cy.contains('Inventory Identification Number').should('exist')

    cy.contains('Supplier').should('exist')

    cy.contains('Product Model Number').should('exist')
    
    cy.contains('Low Stock Threshold').should('exist')

    cy.contains('Purchase Order').should('exist')

    cy.contains('Category').should('exist')

    cy.contains('Remove Stock Price').should('exist')

    cy.contains('Add Stock Price').should('exist')

    cy.contains('Description').should('exist')

  })
  it('Add Reservation Page', () => {
    cy.wait('@getInventory')
    cy.get('table > tbody > tr:first > td').find('svg').closest('a').click({force: true})
    cy.intercept('**/inventory/**').as('getInventoryRoute')
    cy.wait('@getInventoryRoute').its('response.statusCode').should('eq', 200)
    cy.get('button[data-cy="moreMenu"]').click({force: true})
    cy.get('.dropdown-item').contains('Reserve').click({force: true})
    cy.get('.modal').should('have.class', 'show')
  })
  it('FE-2260 - Standardize Screen Detail', () => {
    cy.get('[data-cy="viewTable"]').first().click({force: true})
    cy.get('[data-cy="card-title"]').should('contain', 'Inventory Information')
    cy.get('[data-cy="detail-container"] div:first div').should('have.class', 'bg-gray-100')
  })
})

describe('Actions on Detail Inventory', () => {
  beforeEach( () => {
    cy.visit('inventory')
    cy.intercept('GET', '**/inventory*', {fixture: 'inventorys'}).as('getInventory')
    cy.intercept('GET', '**/inventory/*').as('getInventoryDetail')
    cy.intercept('GET', '**/inventory/*/print').as('printInventory')
    cy.wait('@getInventory')
    cy.get('table > tbody > tr:first > td').find('svg').closest('a').click({force: true})
    cy.wait('@getInventoryDetail')
  })
  it('Print', () => {
    cy.get('[data-bs-toggle="tooltip"][title="Print"]').click({force: true})
    cy.wait('@printInventory').its('response.statusCode').should('eq', 200)
  })
  it('Edit', () => {
    cy.get('[data-bs-toggle="tooltip"][title="Edit"]').click({force: true})
    cy.wait('@getInventoryDetail').its('response.statusCode').should('eq', 200)
    cy.url().should('contain', 'inventory/add')
  })
  it('Delete', () => {
    cy.get('[data-bs-toggle="tooltip"][title="Delete"]').click({force: true})
    cy.get('.modal').should('have.class', 'show')
  })
  it('Email', () => {
    cy.get('[data-bs-toggle="tooltip"][title="Email"]').click({force: true})
    cy.get('.modal').should('have.class', 'show')
  })
})

describe('[ Detail Inventory ] Stock', () => {
  beforeEach(() => {
    cy.visit('inventory/detail/148dcf66-8e5c-41a7-812f-c796f22909df')
    cy.intercept('GET', '**/inventory/*').as('fetchInventory')
  })

  it('Data Stock Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)

    cy.wait(10000)
    cy.get('[data-cy=btnQuantity]').click({force:true})
  })

  it('Add Stock Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=addMenu]').click({force: true})
    cy.get('.dropdown-menu.show').within(() => {
      cy.get('[data-cy=btnAddstock]').click({force: true})
    })
    
    cy.get('form').within( () => {
      cy.get('select[name=location_guid]').select('31b42b1b-9807-4c6f-bf83-8790ef8bc772', {force: true})
      cy.get('input[name=quantity]').type('1', {force: true})
      cy.get('select[name=currency_price]').select('MYR', {force: true})
      cy.get('input[name=priceUnit]').type('10000', {force: true})
      cy.get('select[name=supplier_guid]').select('93ff6936-6aa5-4818-9c65-46969da55324', {force: true})
      cy.get('select[name=user_guid]').select('70d676c7-6308-4ee8-8a7e-c788bae896db', {force: true})
      cy.get(':nth-child(7) > .input-group').click({force: true})
      cy.get('[data-value="6"]').click({force: true})
      cy.get('textarea[name=description]').type('add stock', {force: true})

      cy.get('button.btn-primary > span.indicator-label').click({force: true})
      cy.intercept(
        'POST', 
        '**/inventory/148dcf66-8e5c-41a7-812f-c796f22909df/remove-stock*'
      ).as('addStock')
    })
  })

  it('Remove Stock Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=moreMenu]').click({force: true})
    cy.get('.dropdown-menu.show').within(() => {
      cy.get('.dropdown-item').last().click({force: true})
    })
    
    cy.get('form').within( () => {
      cy.get('select[name=location_guid]').select('31b42b1b-9807-4c6f-bf83-8790ef8bc772', {force: true})
      cy.get('input[name=quantity]').type('1', {force: true})
      cy.get('textarea[name=description]').type('Remove', {force: true})
      cy.get('input[name=include_file]').check({force: true})
      cy.get('button.btn-primary > span.indicator-label').click({force: true})
      cy.intercept('PUT', '**/inventory/*/remove-stock*').as('removeStock')
    })
  })

  it('History Stock Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)

    cy.wait(10000)
    cy.get('[data-cy=moreMenu]').click({force: true})
    cy.get('[data-cy=btnHistorystock]').click({force:true})
  })
})

describe('[ Detail Inventory ] Reservation', () => {
  beforeEach(() => {
    cy.visit('inventory/detail/148dcf66-8e5c-41a7-812f-c796f22909df')
    cy.intercept('GET', '**/inventory/*').as('fetchInventory')
    cy.intercept('POST', '**/inventory/add-reservation/*').as('addReservation')
    cy.intercept('PUT', '**/inventory/reservation/*').as('updateReservation')
  })

  it('Data Reservation Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)

    cy.wait(10000)
    cy.get('[data-cy=btnReservation]').click({force:true})
  })

  it('Add Reservation Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=moreMenu]').click({force: true})
    cy.get('.dropdown-menu.show').within(() => {
      cy.get('[data-cy=btnReservation]').click({force:true})
    })
  
    cy.get('form').within( () => {
      cy.get('input[name=quantity]').clear({force:true})  

      cy.get(':nth-child(1) > :nth-child(2) > .input-group > .rdt > .form-control').click({force:true})  
      cy.get(':nth-child(1) > :nth-child(2) > .input-group > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="6"]')
      cy.get(':nth-child(2) > :nth-child(2) > .input-group > .rdt > .form-control').click({force:true})  
      cy.get(':nth-child(2) > :nth-child(2) > .input-group > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="6"]').click({force:true})

      cy.get('select[name=location_guid]').select('03eca746-116f-454b-8e92-ae6a809b144b', {force: true})
      cy.get('input[name=quantity]').type('100', {force:true})  
      cy.get('select[name=user_guid]').select('70d676c7-6308-4ee8-8a7e-c788bae896db', {force: true})
      cy.get('textarea[name=description]').type('Test Reservation', {force: true})

      cy.get('.modal-footer > .btn-primary').click({force: true})
      cy.wait('@addReservation').its('response.statusCode').should('be.oneOf', [200, 201])
    })
  })

  it('Update Reservation Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=btnReservation]').click({force:true})

    cy.wait(5000)
    cy.get('[data-cy=btnReservationwarning]').click({force: true, multiple: true})
    cy.get('form').within( () => {
      cy.get('input[name=quantity]').clear({force:true})  
      cy.get('textarea[name=description]').clear({force:true})  

      cy.get(':nth-child(1) > :nth-child(2) > .input-group > .rdt > .form-control').click({force:true})  
      cy.get(':nth-child(1) > :nth-child(2) > .input-group > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="6"]')
      cy.get(':nth-child(2) > :nth-child(2) > .input-group > .rdt > .form-control').click({force:true})  
      cy.get(':nth-child(2) > :nth-child(2) > .input-group > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="6"]').click({force:true})

      cy.get('select[name=location_guid]').select('03eca746-116f-454b-8e92-ae6a809b144b', {force: true})
      cy.get('input[name=quantity]').type('100', {force:true})  
      cy.get('select[name=user_guid]').select('70d676c7-6308-4ee8-8a7e-c788bae896db', {force: true})
      cy.get('textarea[name=description]').type('Test Reservation', {force: true})

      cy.get('.modal-footer > .btn-primary').click({force: true})
      // cy.wait('@updateReservation').its('response.statusCode').should('be.oneOf', [200, 201])
    })
  })

  it('Detail Reservation Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=btnReservation]').click({force:true})

    cy.wait(5000)
    cy.get('[data-cy=btnReservationprimary]').click({force: true, multiple: true})
  })

  it('Delete Reservation Inventory', () => {
    cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
    
    cy.wait(5000)
    cy.get('[data-cy=btnReservation]').click({force:true})

    cy.wait(5000)
    cy.get('[data-cy=btnReservationdanger]').click({force: true, multiple: true})

    cy.wait(5000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })
})

describe('Case By Tickets', () => {
  beforeEach( () => {
    cy.visit('inventory')
    cy.intercept('**/inventory*').as('getInventory')
    cy.intercept('**/inventory/**').as('detailInventory')
    cy.intercept('POST', '**/inventory/**/send-email').as('sendEmail')
    cy.wait('@getInventory')
    cy.get('[data-cy="viewTable"]:first').click({force: true})
  })

  it('BUG-91 [INVENTORY] can not email inventory', () => {
    cy.wait('@detailInventory')
    cy.get('[data-cy="btn-email"]').click({force: true})
    cy.get('.modal').invoke('show').should('have.class', 'show')
    cy.get('select[name="team_guid"]').type('{uparrow}', {force: true}).find('option:last').click({force: true})
    cy.get('input[name="email"]').type('mail@mail.com ', {force: true})
    cy.get('textarea[name="notes"]').type('notes', {force: true})
    cy.get('button[type="submit"]').contains('Send Email').click({force: true})
    cy.wait('@sendEmail').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})
