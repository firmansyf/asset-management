/* eslint-disable cypress/no-unnecessary-waiting */

beforeEach(cy.login)

describe('User List', () => {
  beforeEach( () => {
    cy.visit('user-management/users')
    cy.intercept('**/user/filter*').as('fetchUsers')
    cy.wait('@fetchUsers').its('response.statusCode').should('eq', 200)
  })

  it('fetch users', () => {
    cy.get('.table-responsive table').find('tbody > tr').should('have.length.greaterThan', 0)
  })
  
  it('search user John Doe', () => {
    cy.get('input[data-cy=searchUser]').type('John',{force: true})
    cy.wait('@fetchUsers').its('response.statusCode').should('eq', 200)
  })

  // it('Should filter user by First Name', () => {
  //   cy.get('[data-cy=filter] button', ).click({force: true})
  //   cy.intercept('GET',`${Cypress.env('api')}user/filter?&page=1&limit=10&orderCol=first_name&orderDir=asc`, {statusCode: 200})
  //   cy.get('input#column-0').check().should('has.value', 'first_name')
  //   cy.get('[data-cy=filterButton0').should('contain', 'Choose First Name')
  // })
  // it('Should Sort user by Last Name', () => {
  //   cy.get('[data-cy=sort]').find('.d-flex').contains('Last Name').click({force: true})
  //   cy.intercept('GET',`${Cypress.env('api')}user/filter?&page=1&limit=10&orderCol=last_name&orderDir=asc`, {statusCode: 200})
  //   cy.get('.table-responsive table').find('tbody > tr > td').not('.sticky-cus').should('contain', 'account')
  // })
  // it('Should Export to PDF', () => {
  //   cy.get('[data-cy=actions] button', ).click({force: true})
  //   cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToPDF]').click({force: true})
  //   cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  // })
})

describe('User CRUD', () => {
  beforeEach( () => {
    cy.visit('user-management/users')
    cy.intercept('**/user/filter*').as('fetchUsers')
    cy.wait('@fetchUsers')
  })

  it('fetch users', () => {
    cy.get('.table-responsive table').find('tbody > tr').should('have.length.greaterThan', 0)
  })

  it.only('[User-Management] Add User', () => {
    cy.get('[data-cy=addUser]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  
    cy.get('form').within( () => {
      cy.get('input[name=role]').type('{downarrow}', {force: true})
      cy.get('input[name=first_name]').type('John', {force: true})
      cy.get('input[name=last_name]').type('Doe', {force: true})
      cy.get('input[name=job_title]').type('Software Engineer', {force: true})
      // cy.get('[data-cy=company_guid]').type('{downarrow}', {force: true})
      // cy.get('[data-cy=company_department_guid]').type('{downarrow}', {force: true})
      // cy.get('input[name=phone_number]').type('0812345678910', {force: true})
      cy.get('input[name=email]').type('johndoe@assetd.xyz', {force: true})
      // cy.get('select[name=timezone]').then(($timezone) => {
      //     $timezone.val('America/Bogota')
      // })
      // cy.get('input[name=timezone]')
      // cy.get('select[name=date_format]').select('yyyy-mm-dd')
      // cy.get('select[name=time_format]').select('hh:mm (12-hour)')
      cy.get('button.btn-primary > span.indicator-label').click()
    })
    cy.intercept(`**/user`).as('newUser')
  })

  it('Should Add User ( Check Notif Mandatory )', () => {
    cy.get('[data-cy=addUser]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(1000)
    cy.get('button.btn-primary > span.indicator-label').click()
    cy.wait(1000)
    cy.contains('Role is required').should('exist')
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })

  it('[User-Management] Edit User', () => {
    cy.get('.table-responsive table').within(() => {
      cy.get('[data-cy=editTable]:first').click({force: true})
    })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('form').within(() => {
      cy.get('input[name=role]').type('{downarrow}', {force: true})
      cy.get('input[name=job_title]').type('Software Engineer Manager', {force:true})
      cy.get('input[name=phone_number]').type('22345678910', {force:true})
      // cy.fixture('images/profile.png').then( fileContent => {
      //   cy.get('input[type=file]').attachFile({
      //     fileContent: fileContent.toString(),
      //     fileName: 'images/profile.png',
      //     encoding: 'utf-8',
      //     mimeType: 'image/png'
      //   })
      // })
    })
    // cy.get('.modal-footer > .btn-sm.btn.btn-primary > .indicator-label').contains('Save').click()
    // cy.intercept('PUT',`${Cypress.env('api')}user/*`, (req) => {
    //   req.reply({
    //     statusCode: 201
    //   })
    // }).as('editUser')
  })

  it('[User-Management] Delete User', () => {
    cy.get('.table-responsive table')
    cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=deleteTable]').click({force: true})
    cy.get('[role=dialog]').should('have.class', 'fade modal show')
    cy.get('.modal-footer > .btn-primary').contains('Delete').click({force : true})
    cy.intercept('DELETE', '**/api/**').as('deleteUser')
    // cy.intercept('DELETE',`${Cypress.env('api')}user/*?notify_user=1`, (req) => {
    //   req.reply(
    //     {"message":"User johndoe@mailinator.com was successfully deleted","data":{"guid":"9e35ac7b-df92-446b-aff1-7565f33cf6b9"}}
    //   )
    // .as('deleteUser')
  })

  it('[User-Management] Detail User', () => {
    cy.get('[data-cy=viewTable]:first').click({force: true})
     cy.get('.modal').should('have.class', 'show')
   })
})
