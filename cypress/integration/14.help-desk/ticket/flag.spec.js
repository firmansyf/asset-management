beforeEach(cy.login)
describe('Helpdesk | Ticket', () => {
    it('Flag Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                        // cy.get('thead > tr > th').should('have.length', 2) 
                        // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Assignee Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Resolve Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Interactive Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Fordward Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Pending Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Continue Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Print Ticket', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     // cy.get('thead > tr > th').should('have.length', 2) 
                      // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })

    it('Continue Ticket Include Interaction', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                        // cy.get('thead > tr > th').should('have.length', 2) 
                        // cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        // cy.get('[data-cy=flagTicket]').click({force : true})
        // cy.intercept('GET', '**/help-desk/**').as('flag')
    })
})