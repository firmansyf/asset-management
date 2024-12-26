/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Setup Database', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('FE-1389 Check Permission', () => {
    cy.wait(5000)
    // cy.hasPermission('setting.database.view')
  })
})

describe('Setup Database Inventory', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    // cy.intercept('GET', '**/setting/database/inventory').as('getDatabase')
  })

  it('check required Inventory Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="six"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Inventory Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="six"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Inventory Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])
    
    cy.get('[data-rb-event-key="six"]').click({force:true})  
    
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Inventory Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="six"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Insurance Policies', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    // cy.intercept('GET', '**/setting/database/insurance').as('getDatabase')
  })

  it('check required Insurance Policies Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="fifth"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Insurance Policies Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="fifth"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Insurance Policies Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])
    
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Insurance Policies Table', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    // cy.wait('@getDatabase').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-rb-event-key="fifth"]').click({force:true})

    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Asset', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('check required Asset Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Asset Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Asset Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Asset Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Location', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('check required Location Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Location Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Location Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Location Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Employee', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('check required Employee Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Employee Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Employee Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Employee Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Warranty', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('check required Warranty Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Warranty Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Warranty Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Warranty Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})

describe('Setup Database Ticket', () => {
  beforeEach(() => {
    cy.visit('setup/databases')
  })

  it('check required Ticket Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequiredYes"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('default required Ticket Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkRequired"]').click({force:true, multiple:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })
  
  it('check column Ticket Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})  
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})
  })

  it('default column Ticket Table', () => {
    cy.get('[data-rb-event-key="fifth"]').click({force:true})
    cy.wait(5000)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy="checkboxAll"]').click({force:true})
    cy.get('.active > .d-grid > .btn-sm').click({force:true})    
  })
})