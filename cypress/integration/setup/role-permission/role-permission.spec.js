beforeEach(cy.login)
describe('Role Permission, Testing..', () => {
    beforeEach(() => {
        cy.visit('setup/role-permission')
        cy.intercept('GET', `**/setting/role**`, ).as('GetRolePermission')
        cy.wait('@GetRolePermission')
    })

    it('Test Fetch Role Permission', () => {
        cy.contains('Roles & Permission').should('exist')
        cy.contains('Security Rules').should('exist')

        // cy.get('.post').within(() => {
        //     cy.get('#kt_content_container').find('.card-header').find('h4').contains('Security Rules')
        //     cy.get('.table-responsive > [data-cy=table]').within(() => {
        //        cy.get('thead > tr > th').should('have.length', 5)
        //        cy.wait('@GetRolePermission').its('response.statusCode').should('eq', 200)
        //     })
        // })
    })

    it('Test Description Roles', () => {
        cy.get('.decriptionRoles') 
        cy.contains('Decide which parts of your account you want accessible to your users by assigning them to Permission Roles. You can use and edit the predetermined roles or you can create your own custom roles.').should('exist')
    })

    it('Test Sort by Multiple Header', () => {
        cy.get('[data-cy=sort]:first').click({force: true}, {multiple : true})
        cy.wait('@GetRolePermission')
    })

    // it('Test Number for Data', () =>  cy.get('select[name*="number_of_page"]').select('25'))
    it('Test Pagination', () => {
        cy.get('#kt_content_container > div > div.card-body > div > div.row.align-items-center.border-top.border-2 > div.col.pt-5.d-block > div > div:nth-child(2) > button').click({force: true})
        // cy.get('.previous').find('.page-link').click({force : true})
        // cy.get('.next').find('.page-link').click({force : true})
    })
})

describe('Create a New Role, Testing...', () => {
    it('Create a New Role', () => {
        cy.visit('setup/role-permission')
        cy.intercept(`**/api/**`, ).as('GetRolePermission')
        cy.wait('@GetRolePermission')
        cy.get('[data-cy=addNewRole]').click({force : true})
        cy.wait('@GetRolePermission')
        cy.contains('Add Roles & Permissions').should('exist')

        cy.get('.card-body').find('.col-sm-5').within(() => {
            cy.get('[data-cy=inputName]').type('Role',{force: true})
            cy.get('input[name*=description]').type('Cypress',{force: true})
        })
        cy.get('[name=checkall]').check({force: true})

        // cy.get('.body-permission').within(() => {
        //     cy.get('.active > .mt-5 > .container > :nth-child(3) > :nth-child(1) > .row > .col-sm-11 > .table > thead > .border-bottom > [style="width: 10px;"] > .form-check > .form-check-input')
        //       .click({force : true}, {multiple: true})
        //     cy.get('[data-rb-event-key="locations"]').click({force : true})
        // })
        cy.get('.card-footer').find('button[type=submit]').click({force : true})
        cy.wait('@GetRolePermission')
    })
})

describe('Test Owner Role, Edit & Delete', () => {
    it('Role Owner. Edit', () => {
        cy.visit('setup/role-permission')
//         cy.get('[data-cy=editTable]:first').click({force : true})
//         cy.get('.card-body').find('.col-sm-5').within(() => {
//             cy.get('input[name*="name"]').should('have.value', 'Account Owner')
//               .clear({force : true}).type('Test', {force : true})
//             cy.get('input[name*="description"]').should('have.value', 'Test')
//                .clear({force : true}).type('Test', {force : true})
//         })
//         cy.get('.card-footer').find('button[type=submit]').click({force : true})
//         cy.intercept('GET', `**/setting/role/*`, {statusCode :  200}).as('editRolePermission')
    })

    it('Role Owner. Delete', () => {
        cy.visit('setup/role-permission')
//      cy.get('[data-cy=deleteTable]:first').click({force : true})
    })
})

describe('Test Admin Role, Edit & Delete. Testing...', () => {
    it('Role Admin. Edit', () => {
        cy.visit('setup/role-permission')
//         cy.get('[data-cy=editTable]:first').click({force : true})
//         cy.get('.card-body').find('.col-sm-5').within(() => {
//             cy.get('input[name*="name"]').should('have.value', 'Admin')
//               .clear({force : true}).type('Admin Test', {force : true})
//             cy.get('input[name*="description"]').should('have.value', 'Administrative group has access to all permissions except deleting account')
//               .clear({force : true}).type('Cypress', {force : true})
//         })
//         cy.get('.card-footer').find('button[type=submit]').click({force : true})
//         cy.intercept('GET', `**/setting/role/*`, {statusCode :  200}).as('editRolePermission')

    })

    it('Role Admin, Delete', () => {
        cy.visit('setup/role-permission')
//         cy.get('[data-cy=deleteTable]:first').click({force : true})
    })
})

describe('Check Permission Tabs...', () => {
    it('Check Maintenances Tab', () => {
        cy.visit('setup/role-permission')
        cy.get('[data-cy=addNewRole]').click({force : true})
        cy.get('[data-rb-event-key="maintenances"]').click({force : true})
        cy.get('[data-cy="maintenanceTab"] > .mt-5 > .container > :nth-child(3) > :nth-child(1) > .row > .col-sm-11 > .table > thead > .border-bottom > .fw-bold').should('contain', 'Maintenance')
        cy.get('[data-cy="maintenanceTab"] > .mt-5 > .container > :nth-child(3) > :nth-child(2) > :nth-child(1) > .col-sm-11 > .table > thead > .border-bottom > .fw-bold').should('contain', 'Checklist')
        cy.get('[data-cy="maintenanceTab"] > .mt-5 > .container > :nth-child(3) > :nth-child(2) > :nth-child(2) > .col-sm-11 > .table > thead > .border-bottom > .fw-bold').should('contain', 'Meter Reading')
        cy.get('[data-cy="maintenanceTab"] > .mt-5 > .container > :nth-child(3) > :nth-child(2) > :nth-child(3) > .col-sm-11 > .table > thead > .border-bottom > .fw-bold').should('contain', 'Request')
    })
})
