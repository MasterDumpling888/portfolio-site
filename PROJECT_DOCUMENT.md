this project is for my portfolio website. currently i have create the basic structure and a very basic template of a working website. but i need to stylize and make it more "me". in this document below, i have outline the design specifications and requirements.

AI model specifications:

- make to change things slowly, always checking in with the user to confirm the design
- follow the code structure currently on the project
- ensure that the design of the website strictily follows the design specifications of the user.
- before making any design adjustments confirm with the user
- if making big changes in the design, first show the user the "look" by temporarily changing one element and have the user confirm if your design interpretation is correct

## Goals:

- primary
  - Create captivating landing page
  - Ensure that the design is intuitive and mobile friendly
    secondary
  - ensure my personality shines through the design
  - follow a game path design; taking a "character" on a journey of finding out who i am and eventually contacting me
  - i want my heritage to shine through, east asian

## Design specifications

- design should match my personality: funny, quirky, messy, artitistic but professional, and serious and deep when it comes to work (can reflect this by the division between the tech path and the art path)
- follow a pixelated design 16-bit to create this game style but fun aesthetic
- take the user on a journey of discorvering who i am (game paths, user can follow a mini character as it journeys)
  - fonts:
    - title, headings - bevellier (source: fontshare)
    - paragraphs, body texts, button texts - raleway (fonts: google fonts)
  - stylizings:
    - thin border either white or black
    - for the art portfolio colours:
      - use reds, oranges, yellows, greens
    - for the tech portfolio colours:
      - use blues, cyans, magnetas

tech design:

- oop code structure
  - have folder for js, css, assets, pages, etc
  - use json to store content data
    - page content automaticaly updatess base on json content
  - we must strictly keep a modularized method

## Features

- Have quick access to resume
- web site is easy to navigate
- clear division in with other skills
  - primary portfolio showcasing: Tech portfolio
  - secondary: Artistic portfolio
  - the clear division can be showcased through a change in colour, design
- Nav bar:
  - show logo
  - quick navigation to pages
  - theme toggle button
    - when in dark mode
- Pages:
  - Homepage:
    - landing page: interactive, 3D effect by gyro movement, integrate parallax scrolling to begin mini character on its journey
      - User can decide on three options of its character
      - CTA for contacting button: go to contact page
      - Button for downloading resume
      - button to view projects
      - moving down arrow to prompt user to scroll down
    - section 1:
      - about me: "game path" splits
        - left: artistic portfolio
        - right: tech portfolio
        - straight: section 2
        - effects: mini character walks eitehr left or right or straight
      - section 2 "skip to the end":
        - CTA for contacting button: go to contact page
  - project page:
    - page title section:
      - mini character "landing" on either tech or art path
    - "cards" section:
      - game cards for each project
        - effect they flip upon being clicked to reveal descriptions and what skills were involved in making them
        - quick links to github repo if relevant
      - filter based on category of project:
        - tech portfolio: "medtech", "ai-dev", "webdev", "fintech"
        - art portfolio: "web design", "social media content"
  - skill page:
    - design is likened to game character stats screen
      - mini character (preferrably 3d interactive) in the center
      - skill icons are around the character
        - upon hover (desktop) or click (mobile) the skill content (title, proficiencies: either stats bar or basic,intermediate,advanced) slides from icon
          - for language (i.e english, japanese, mandarin): dropdown of each language proficiency from language icon
  - contact page:
    - design is similar to numpad where buttons for differeny way to contact me
      - if user clicks (desktop and mobile) the "dial screen" shows mode and username (i.e LinkedIn: dancia-rachel) "call" button on the right of the "dial screen" will "submit" the url and routes them to corresponding website (i.e LinkedIn profile)
