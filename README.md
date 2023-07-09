<h1 align="center">Welcome to ts-inlay-hints 👋</h1>
<p>
  A guide on how to utilize TypeScript inlay hints in VS Code / Neovim with the TypeScript Language Server
</p>

[![IT Man - Tip #39 - Level Up Your TypeScript: Inlay Hints [Vietnamese]](https://i.ytimg.com/vi/0Y0HrvFQ600/hqdefault.jpg)](https://www.youtube.com/watch?v=0Y0HrvFQ600)

## What is TypeScript inlay hints?

TypeScript inlay hints are inline annotations that appear in your source code while you are coding. They provide additional contextual information about variables, parameters, or function return values. This feature enhances the readability and understanding of your code by providing live insights about your types directly in the code.

Below is a comparison to illustrate how your code looks without and with TypeScript inlay hints:

| Without Inlay Hints | With Inlay Hints |
|---------------------|------------------|
| ![Without Inlay Hints](https://i.gyazo.com/281caeeadcfd81c9f64e56465b9d186f.png) | ![With Inlay Hints](https://i.gyazo.com/e87bd8c0ddffcc027acab50b4b0fde8c.png) |

Here's the same example, represented as code:

**Without Inlay Hints:**
```ts
function greet(name: string) {
  return `Hello, ${name}!`;
}

let user = 'World';
greet(user);
```

**With Inlay Hints:**
```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

let user: string = 'World';
greet(user: string): string;
```

As you can see, the inlay hints provide extra information about the types of the variables and function return values directly in the code, significantly improving readability and understanding.

## How to use

The instructions to set this up are detailed in the following VS Code and Neovim sections.

## VS Code settings

In Visual Studio Code, to enable TypeScript inlay hints, follow these steps:

1. Open settings (File -> Preferences -> Settings or `CMD/Ctrl + ,`).
2. Search for "inlay hints" in the search bar.
3. Look for the "Typescript > Inlay Hints" section. There are several options that can be configured here. You can enable or disable each type of hint individually. 
4. Reload the VS Code for changes to take effect.

[![VSCode inlayHints](https://i.gyazo.com/eea68c7a1d71827af0b3c659c320ca52.png)](https://gyazo.com/eea68c7a1d71827af0b3c659c320ca52)

### My preferred VS Code Settings

Below is a recommended configuration for VS Code when using `inlay-hints`. These settings optimize various aspects of the VS Code environment for JavaScript, TypeScript and Deno development. You can copy and paste these settings into your VS Code settings JSON file.

```json
{
  "editor.inlayHints.fontFamily": "JetBrainsMono NF",
  "editor.inlayHints.padding": true,
  "javascript.inlayHints.enumMemberValues.enabled": true,
  "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.enumMemberValues.enabled": true,
  "deno.inlayHints.enumMemberValues.enabled": true,
  "deno.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  "editor.inlayHints.fontSize": 1
}
```

[![VSCode preferred inlayHints](https://i.gyazo.com/ecec0eb8d42a2214e1540e098a65b371.png)](https://gyazo.com/ecec0eb8d42a2214e1540e098a65b371)

## Neovim settings

For Neovim users, TypeScript inlay hints can be enabled using the nvim-lspconfig and typescript.nvim plugins.

[![Neovim inlayHints](https://i.gyazo.com/95d23014fd5c730fcff0082fc171d214.png)](https://gyazo.com/95d23014fd5c730fcff0082fc171d214)

### Usage with [LazyVim](https://www.lazyvim.org/)

```lua
-- plugins/lspconfig.lua
return {
  "neovim/nvim-lspconfig",
  dependencies = { "jose-elias-alvarez/typescript.nvim" },
  opts = {
    servers = {
      tsserver = {
        settings = {
          typescript = {
            inlayHints = {
              includeInlayParameterNameHints = "all", -- 'none' | 'literals' | 'all'
              includeInlayParameterNameHintsWhenArgumentMatchesName = true,
              includeInlayVariableTypeHints = true,
              includeInlayFunctionParameterTypeHints = true,
              includeInlayVariableTypeHintsWhenTypeMatchesName = true,
              includeInlayPropertyDeclarationTypeHints = true,
              includeInlayFunctionLikeReturnTypeHints = true,
              includeInlayEnumMemberValueHints = true,
            },
          },
          javascript = {
            inlayHints = {
              includeInlayParameterNameHints = "all", -- 'none' | 'literals' | 'all'
              includeInlayParameterNameHintsWhenArgumentMatchesName = true,
              includeInlayVariableTypeHints = true

              includeInlayFunctionParameterTypeHints = true,
              includeInlayVariableTypeHintsWhenTypeMatchesName = true,
              includeInlayPropertyDeclarationTypeHints = true,
              includeInlayFunctionLikeReturnTypeHints = true,
              includeInlayEnumMemberValueHints = true,
            },
          },
        },
      },
    },
    inlay_hints = {
      enabled = true,
    },
    setup = {
      tsserver = function(_, opts)
        require("typescript").setup({ server = opts })
        return true
      end,
    },
  },
}
```

If you are using the stable version of Neovim, you need to install lsp-inlayhints in your config:

```lua
-- plugins/lsp-inlayhints.lua

-- Disable lsp-inlayhints if that is nightly version, will remove when 0.10.0 is stable
local enabled_inlay_hints = true
if vim.fn.has("nvim-0.10.0") == 1 then
  enabled_inlay_hints = true
end

return {
  {
    "lvimuser/lsp-inlayhints.nvim",
    ft = { "javascript", "javascriptreact", "json", "jsonc", "typescript", "typescriptreact", "svelte" },
    enabled = enabled_inlay_hints,
    opts = {
      debug_mode = true,
    },
    config = function(_, options)
      vim.api.nvim_create_augroup("LspAttach_inlayhints", {})
      vim.api.nvim_create_autocmd("LspAttach", {
        group = "LspAttach_inlayhints",
        callback = function(args)
          if not (args.data and args.data.client_id) then
            return
          end

          local bufnr = args.buf
          local client = vim.lsp.get_client_by_id(args.data.client_id)
          require("lsp-inlayhints").on_attach(client, bufnr)
        end,
      })
      require("lsp-inlayhints").setup(options)
      vim.api.nvim_set_keymap(
        "n",
        "<leader>uI",
        "<cmd>lua require('lsp-inlayhints').toggle()<CR>",
        { noremap = true, silent = true }
      )
    end,
  },
}
```

## Resources

Here are some additional resources that you may find helpful when working with TypeScript inlay hints:

### VS Code Extensions

### [VS Code Comment Queries](https://github.com/NWYLZW/vscode-comment-queries/blob/main/README_en-US.md)

This extension enables showing the variable types in your code through annotation syntax and inline prompts.

#### [Total TypeScript VSCode Extension](https://github.com/mattpocock/ts-error-translator)

This extension aims to help you learn TypeScript directly from your IDE. It provides helpful hints on syntax and translates TypeScript's most cryptic errors.

### Neovim Plugins

These plugins can enhance your TypeScript coding experience in Neovim:

#### [lsp-lens.nvim](https://github.com/VidocqH/lsp-lens.nvim)

This plugin displays references and definition info upon functions, similar to JetBrains' IDEA. You can enable/disable specific requests such as definitions, references, and implementations. It also includes declaration in references.

```lua
{
  "VidocqH/lsp-lens.nvim",
  event = "BufRead",
  opts = {
    include_declaration = true, -- Reference include declaration
    sections = { -- Enable / Disable specific request
      definition = false,
      references = true,
      implementation = false,
    },
  },
  keys = {
    {
      -- LspLensToggle
      "<leader>uL",
      "<cmd>LspLensToggle<CR>",
      desc = "LSP Len Toggle",
    },
  },
}
```

### [dim.lua](https://github.com/narutoxy/dim.lua)

dim.lua is a Neovim plugin that dims unused variables and functions using LSP and Treesitter. It is dependent on nvim-treesitter and nvim-lspconfig.

```lua
{
  "narutoxy/dim.lua",
  event = "BufRead",
  dependencies = { "nvim-treesitter/nvim-treesitter", "neovim/nvim-lspconfig" },
  config = true,
}
```

## Author

👤 **Huynh Duc Dung**

-   Website: https://productsway.com/
-   Twitter: [@jellydn](https://twitter.com/jellydn)
-   Github: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

[![kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/dunghd)
[![paypal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/dunghd)
[![buymeacoffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dunghd)
