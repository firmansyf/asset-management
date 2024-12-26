beforeEach(cy.login)

describe('Dashboard Calendar', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/v1/widget*').as('getWidget')
  })

  it('Check Calendar Widget', () => {
    cy.wait('@getWidget').its('response.statusCode').should('eq', 200)
    cy.get('.fc').should('be.visible')
    cy.get('.fc-button-group > button.fc-today-button').should('contain', 'Today').and('be.visible')
    cy.get('.fc-day-mon > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Mon')
    cy.get('.fc-day-tue > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Tue')
    cy.get('.fc-day-wed > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Wed')
    cy.get('.fc-day-thu > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Thu')
    cy.get('.fc-day-fri > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Fri')
    cy.get('.fc-day-sat > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Sat')
    cy.get('.fc-day-sun > .fc-scrollgrid-sync-inner > .fc-col-header-cell-cushion').should('contain', 'Sun')
  })

  it('Check chalender more than 3 event', () => {
    // unit test will be pass if day in calendar have more than 3 event data.  
    cy.wait('@getWidget').its('response.statusCode').should('eq', 200)
    cy.get('.fc-daygrid-day-frame').then((date) => {
        if (date.find('.fc-daygrid-more-link').length > 0) {
            cy.get('.fc-daygrid-more-link').should('contain', 'more').click({force: true})
            cy.get('.fc-popover-header').should('be.visible')
        }
    })
  })
})

