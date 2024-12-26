/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('[ Maintenace Work Order ] Detail Maintenace Work Order', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
  })

  it('Work Order improvement status', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
    // cy.wait(1000)
    // cy.get('[data-cy=CompleteWorkOrder]').click({force:true})
  }) 

  it('Work Order ID', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
    cy.wait(3000)
    cy.contains('Work Order ID').should('exist')
  }) 

  it('Detail Work Order Add Task', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})

    cy.wait(3000)
    cy.get('[data-cy=nameTask]').type('Test Task', {force:true})
    cy.contains('Assign Worker').click({force: true})
    cy.get('#react-select-3-option-0').click({force:true})
    cy.get('[data-cy=saveTask]').click({force:true})
  }) 

  it('Detail Work Order Update Task', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})

    cy.wait(3000)
    cy.get('[data-cy=editTasks]').first().click({force:true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Edit Task')
    
    cy.wait(3000)
    cy.get('[data-cy=updateNameTask]').clear().type('Task Update', {force : true})
    // cy.get('.css-1hb7zxy-IndicatorsContainer > :nth-child(3)').click({force: true})
    // cy.contains('testing account').click({force:true})
    
    // cy.get('.select-assign-cy')
    // .click({force:true})
    // .find('input#selectAssignCy')
    // .type('Agen{enter}', {force: true})

    // cy.contains('Choose Maintenance Status').click({force:true})
    // cy.contains('In Progress').click({force:true})
    cy.get('.modal-footer > .btn-primary').click({force:true})
  }) 

  it('Detail Work Order ( Maintenance Status )', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
    
    if( !cy.contains('status').should('not.exist') ) {
      cy.contains('status').should('exist')
    }
  }) 

  it('[MAINTENANCE] Standardize Work Order', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
  
    cy.wait(3000)
    cy.contains('Work Order Detail').should('exist')

    cy.contains('Work Order ID').should('exist')
    cy.contains('Title').should('exist')
    cy.contains('Description').should('exist')
    cy.contains('Estimate Duration (Minutes)').should('exist')
    cy.contains('Maintenance Category').should('exist')
    cy.contains('Asset by Location').should('exist')
    cy.contains('Status').should('exist')
  })
})


describe('Detail Maintenace Work Order', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
  })

  it('[ Link Work Order ] Detail Maintenance Work Order', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
  
    cy.wait(3000)
    cy.contains('Link Work Order').should('exist')
  }) 

  it('Work Order ID', () => {
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})
    cy.wait(3000)
    cy.contains('Work Order ID').should('exist')
  }) 
})