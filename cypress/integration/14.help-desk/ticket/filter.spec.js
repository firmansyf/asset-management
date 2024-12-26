/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Ticket Filter Function', () => {
    beforeEach(() => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')
    })

    it('Filter All Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-allticket]').click({ force: true }) 
        })
    })

    it('Filter My Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-0]').click({ force: true }) 
        })
    })

    it('Filter All Unresolved Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-1]').click({ force: true }) 
        })
    })

    it('Filter All Pending Approval Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-2]').click({ force: true }) 
        })
    })

    it('Filter All Pending Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-3]').click({ force: true }) 
        })
    })

    it('Filter Open and High Priority Tickets', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-4]').click({ force: true }) 
        })
    })

    it('Filter Flags', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-5]').click({ force: true }) 
        })
    })

    it('Filter Spam', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-6]').click({ force: true }) 
        })
    })

    it('Filter Bookmarks', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-7]').click({ force: true }) 
        })
    })

    it('Filter Archive', () => { 
        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('[data-cy=quickFilter]').click({ force: true }) 
            cy.wait(5000)
            cy.get('[data-cy=quick-8]').click({ force: true }) 
        })
    })
})