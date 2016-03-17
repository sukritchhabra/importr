# importr

Importr is a tool that allows users to search and create a combination of library CDN's to add to web pages. It eases the process of searching for links individually and adding them one by one by providing a way to collect them in one place by searching and then copying them together.

## Usage
- Testing is the foremost use of this tool. A lot of times, collaborative testing on environments such as jsFiddle and jsBin can become cumbersome because the snippet that needs to be tested is dependent on various libraries. These environments provide their own ways of adding **external resources** but I feel there is room for improvement there.

- By allowing users an environment to search for all the libraries that they want/need, having them collect them, and copy them together, we can save a lot of tedious searching for CDN links on individual websites.

- I do not imagine the tool being used extensive for much bigger projects, specially with resources such as **Bower** and **Node** at our disposal, but it might end up being useful in various situations.

## Example

![Importr Preview](http://sukritchhabra.com/importr/imgs/importr.gif)

## Contributing to the Project
#### Contributing to the project is easy.
- Report Issues under Issues

- If you want to add a library, you'll have to do the following:
    - Create a folder for you library in the `libraries` folder.
    - Name your folder (library) appropriately as that is what'll show up in the search.
    - Inside the folder for your library, create a file called `lib.json`
    - Take a look at sample package.json file for Bootstrap here: https://github.com/sukritchhabra/importr/blob/dev/libraries/Bootstrap/package.json
    - These are all the important properties and are important for creating the webpages.
        - `Readme:` Covert the raw Readme of your library to a `rawgit` link
        - `cdnLinkStructure:` You can choose any CDN you want to submit, but I suggest using `CDNJS`
    - To add your library to the search, add your library to the file `libraries/libraries.json`. Follow the structure of the JSON and add the tags too.
    - Send in your Pull Request
    - That's it, that's all you have to do! As soon as the PR is merged your library should be available to users on the website!

## Author
* Sukrit Chhabra - sukrit.chhabra@gmail.com

## Misc
* Drexel UI Blog: https://drexelui.wordpress.com/#post-464