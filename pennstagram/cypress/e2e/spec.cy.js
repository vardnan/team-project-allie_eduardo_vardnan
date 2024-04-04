describe('Tests login screen', () => {
    it('Tests login functionality with valid username and password', () => {
      // cy.visit('http://localhost:8080');
      cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
      cy.get('[data-cy="username"]').type('alice123');
      cy.get('[data-cy="password"]').type('password123');
      cy.get('[data-cy="sign-in"]').click();
      // cy.url().should('include', 'http://localhost:8080');
      cy.url().should('include', 'https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
    });
  
    it('Tests invalid account', () => {
      // cy.visit('http://localhost:8080');
      cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
      cy.get('[data-cy="username"]').type('aalice123');
      cy.get('[data-cy="password"]').type('password1232');
      cy.get('[data-cy="sign-in"]').click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Error: User not found');
      });
    });
  
    it('Tests invalid username OR password', () => {
      // cy.visit('http://localhost:8080');
      cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
      cy.get('[data-cy="username"]').type('bob_smith');
      cy.get('[data-cy="password"]').type('password1232');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Error: Incorrect username or password');
      });
    });
  });
  
describe('Test registering a user', () => {
it('Test clicking like button', () => {
    // cy.intercept('POST', 'http://localhost:8080/signup').as('signup');
    cy.intercept('POST', 'https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/signup').as('signup');
    // cy.visit('http://localhost:8080');
    cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
    cy.contains("Don't have an account? Sign Up").click();
    cy.url().should('include', '/signup');
    cy.get('[data-cy="signup-email"]').type('eric10@email.com');
    cy.get('[data-cy="signup-username"]').type('james10');
    cy.get('[data-cy="signup-password"]').type('jamesspassword12@A');
    cy.get('[data-cy="signup-image"]').type('https://picsum.photos/200');
    cy.get('[data-cy="signup-bio"]').type('Hello world! Excited to be here');
    cy.get('[data-cy="signup-button"]').click();
    cy.wait('@signup').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    });
});
});

describe('Tests liking a post', () => {
it('Test clicking like button', () => {
    // cy.visit('http://localhost:8080');
    cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
    cy.get('[data-cy="username"]').type('bob_smith');
    cy.get('[data-cy="password"]').type('bobspassword');
    cy.get('[data-cy="sign-in"]').click();

    cy.get('[data-cy="like-button"]')
    .first()
    .then(($button) => {
        if ($button.text().includes('Like')) {
        cy.wrap($button).click().should('contain', 'Unlike');
        } else if ($button.text().includes('Unlike')) {
        cy.wrap($button).click().should('contain', 'Like');
        }
    });
});
});

describe('Test creating a post', () => {
it('Test sucessfully creating a post displayed in the feed', () => {
    // cy.intercept('POST', 'http://localhost:8080/posts').as('createPost');
    cy.intercept('POST', 'https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/posts').as('createPost');
    // cy.visit('http://localhost:8080');
    cy.visit('https://allie-eduardo-vardnan-557-1d6e0e35c330.herokuapp.com/');
    cy.get('[data-cy="username"]').type('bob_smith');
    cy.get('[data-cy="password"]').type('bobspassword');
    cy.get('[data-cy="sign-in"]').click();
    cy.contains('Create').click();
    cy.url().should('include', '/create');
    // cy.get('[data-cy="image-url"]').type('https://picsum.photos/200');
    // Attach a file instead of typing a URL
    cy.get('[data-cy="image-file"]').attachFile('./smallImageLion.jpg');
    cy.get('[data-cy="image-caption"]').type('Cypress is so fun');
    cy.get('[data-cy="create-post-button"]').click();
    cy.wait('@createPost').then((interception) => {
    expect(interception.response.statusCode).to.eq(201);
    cy.contains('Home').click();
    cy.get('[data-testid="activity-feed"]').within(() => {
        cy.get('#feed-post')
        .first()
        .within(() => {
            cy.get('#feed-post-post').should(
            'have.attr',
            'src',
            'https://cis557group10.s3.us-east-1.amazonaws.com/smallImageLion.jpg'
            );
            cy.get('#feed-post-caption').should('contain', 'Cypress is so fun');
        });
    });
    });
});
});
