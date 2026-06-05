---
title: Code snippets
description: Creating your own open source projects can be extremely rewarding, but it can be hard to break through the noise and get other developers to trust and use your software. You can gain a lot of ground b…
image: /assets/blog/code-snippets/cover.webp
createdAt: 2018-03-07
updatedAt: 2018-03-07
---

# Intro

Creating your own open source projects can be extremely rewarding, but it can be hard to break through the noise and get other developers to trust and use your software. You can gain a lot of ground by following [common best practices](https://opensource.guide/) like including solid documentation, adding unit tests, integrating with a CI/CD oriented towards open-source projects (like [travis-ci](https://travis-ci.org/) or [circle-ci](https://circleci.com/)), and enforcing consistent style conventions.

One of the most effective and easiest ways I’ve found to make open source projects really stand out from the crowd is **adding quality screenshots or animated demos**. Whenever I see this attention to detail, not only does it prove to me that the author cares about the project, but it’s the absolute fastest way to convey what the project actually does.

![Animation Credit: [CSS-only coding animation](/assets/blog/code-snippets/css-only-coding-animation) by [Chris Dermody](http://chrisdermody.com/)](/assets/blog/code-snippets/css-coding.gif)

Animation Credit: [CSS-only coding animation](http://chrisdermody.com/css-only-coding-animation/) by [Chris Dermody](http://chrisdermody.com/)

> A picture is worth a thousand words. — Cliche saying that’s totes relevant
> 

Including quality screenshots and demos is becoming an increasingly important part of what I’d call **Developer UX**, that is the flow a prospective developer takes from considering adding your project as a dependency all the way through successful integration and future maintenance.

Towards that end, we’ll be looking at three common use cases for improving the developer UX of your open source projects with media:

- Static code snippets (images)
- Animated code demos (GIFs or animated SVGs)
- Project screencasts (videos)

# **Static Code Snippets**

Sharing small bits of static code is definitely the most common and important use case on this list. Every open source project’s readme should include some easily parseable *example usage* snippet, so let’s start there.

## **GitHub-Flavored Markdown Snippets**

At the easiest end of the spectrum, GitHub allows [syntax highlighting](https://guides.github.com/features/mastering-markdown/) in markdown code snippets. Hopefully, this style of embedding is familiar to you, and if not, I would definitely recommend starting here.

```jsx
const pMap = require('p-map')
const got = require('got')

const sites = [
  getWebsiteFromUsername('sindresorhus'), //=> Promise
  'ava.li',
  'todomvc.com',
  'github.com'
]

const mapper = el => got.head(el).then(res => res.requestUrl)

pMap(sites, mapper, { concurrency: 2 })
  .then(result => {
    console.log(result)
    //=> ['http://sindresorhus.com/', 'http://ava.li/', 'http://todomvc.com/', 'http://github.com/']
  })
```

## **GitHub Gists**

The code snippet above also provides an example of an extremely popular way of sharing static code snippets via [GitHub Gists](https://help.github.com/articles/about-gists/), which have the following advantages:

- Linkable
- Support versioning
- Support discussion via comments
- Syntax highlighting

## **Carbon**

Markdown snippets and GitHub gists are both useful, but if you really want to make your code pop, then look no further than [Carbon](https://github.com/dawnlabs/carbon).

![Image Credit: [Carbon](/assets/blog/code-snippets/carbon)](/assets/blog/code-snippets/carbon.png)

Image Credit: [Carbon](https://github.com/dawnlabs/carbon)

Carbon is a very popular open source project that allows you to easily create aesthetically pleasing code screenshots, along with a plethora of customization options and community plugins. It’s a great choice for making a hero image standout in your readme, increasing engagement on social media, or for writing engineering-related blog posts like this one 😛.

# **Animated Code Demos**

Including a high quality, inline demo that quickly demonstrates your project’s core use case is the single most important suggestion I have to give.

There are a ton of different ways to go about creating these types of demos, however, so I’d like to discuss what I’ve found to be the best approach here.

> Asciinema is a free tool that lets you record and share your terminal sessions, the right way.
> 

[**Asciinema**](https://asciinema.org/) provides a lightweight, purely text-based approach to terminal recording, which allows you to make lossless recordings that can then be shared directly or rendered to animated SVG, animated GIF, or video. It surprised me just how many popular open source projects on GitHub make use of Asciinema — I would highly recommend checking it out.

![Example Asciinema screencast converted to a GIF (credit: [create-react-library](/assets/blog/code-snippets/create-react-library)) Note that the quality of this embedded GIF is much lower than the animated SVG in the linked [readme](https://github.com/transitive-bullshit/create-react-library) as discussed below.](/assets/blog/code-snippets/crl.gif)

Example Asciinema screencast converted to a GIF (credit: [create-react-library](https://github.com/transitive-bullshit/create-react-library)) Note that the quality of this embedded GIF is much lower than the animated SVG in the linked [readme](https://github.com/transitive-bullshit/create-react-library) as discussed below.

## **Animated SVG or GIFs?**

We all know GIFs are a horribly inefficient, lossy format, but let’s dig a little deeper into this particular use case.

Compare the above embedded screencast gif to the animated SVG of the same screencast from the [readme](https://github.com/transitive-bullshit/create-react-library). It’s difficult to embed an inline comparison side-by-side, but the animated SVG is **significantly sharper and smaller**, coming in at 73kb vs 4.4MB for the lower quality GIF.

Why is this even a discussion then? Well, you can’t exactly include custom HTML in a Medium blog post, now can you? And for that matter, there are a lot of places where using custom animated SVGs won’t fly, and for the foreseeable future, GIFs will live on as a fallback for those use cases. But open source authors, please consider using animated SVG versus GIFs for your GitHub projects!

There are some very popular open source projects on GitHub that have started using more efficient animated SVGs for their demos, such as [create-react-app](https://github.com/facebook/create-react-app), but in general, you’ll find GIFs to be much more common.

Here's a few examples of using the excellent [svg-term-cli](https://github.com/marionebl/svg-term-cli) to generate our lossless animated SVG.

```bash
# generate animated SVG
svg-term --cast 'fxdtpprue51QZkeViQurqPg8V' --out demo.svg --window --width=80 --height=24 --term=iterm2 --profile=Snazzy

# generate single frame SVG at 20 seconds into the screencast
svg-term --cast 'fxdtpprue51QZkeViQurqPg8V' --out screenshot.svg --window --width=80 --height=24 --term=iterm2 --profile=Snazzy --at 20000
```

It’s important to note that when discussing animated SVGs, we’re really talking about embedding an HTML snippet into GitHub-flavored markdown that links to an SVG file encoded with each frame as an SVG group and the animation defined via CSS keyframes (example SVG source).

```html
<p align="center">
  <img width="600" src="https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/demo.svg">
</p>
```

Insert this HTML snippet into any GitHub-flavored markdown file to embed the linked animated SVG with optimal sharpness and low size overhead compared with a comparable GIF.

For reference, here is the screencast from [create-react-library](https://github.com/transitive-bullshit/create-react-library) we’ve been using as an example in several different formats:

- Original [asciicast](https://asciinema.org/a/167645)
- High quality [animated SVG](https://camo.githubusercontent.com/3f38f2bacbc1a6b49a5172232e8a4ccb9f10173f/68747470733a2f2f63646e2e7261776769742e636f6d2f7472616e7369746976652d62756c6c736869742f6372656174652d72656163742d6c6962726172792f6d61737465722f6d656469612f64656d6f2e737667) created with [svg-term-cli](https://github.com/marionebl/svg-term-cli)
- Low quality [GIF](/assets/blog/code-snippets/1*6XX4DHE0HSHrGjiLFxmigQ.gif) created with [asciicast2gif](https://github.com/asciinema/asciicast2gif)

## **Capturing and Optimizing GIFs**

Asciinema is great for terminal-based recording, but what if you want to record a UI component or website? Well, my first and foremost answer here is to always include a usable demo if possible alongside your project, especially if it’s a frontend web project. It’s really easy to get started with GitHub [Page’s](https://pages.github.com/) free hosting!

If you do want to include a GIF, I’d recommend using either [GIPHY Capture](https://giphy.com/apps/giphycapture) or [Kap](https://getkap.co/) to record your screen and output a GIF. Alternatively, if you have a video recorded from another source, I’d recommend using [Gifski](https://github.com/sindresorhus/gifski-app) to convert the video to an as-optimized-as-possible GIF for ease of embedding.

```markdown
<!-- html snippet customizing embedded gif -->
<img src="https://cdn.rawgit.com/terkelg/prompts/master/media/number.gif" alt="example prompt" width="499" height="103" />

<!-- raw markdown can also be used to ambed a gif -->
![](/assets/blog/code-snippets/number.gif)
```

![Quality demo GIF embedded in readme using the snippet above. (image credit: [prompts](/assets/blog/code-snippets/prompts) by [terkelg](https://github.com/terkelg))](/assets/blog/code-snippets/prompts.gif)

Quality demo GIF embedded in readme using the snippet above. (image credit: [prompts](https://github.com/terkelg/prompts) by [terkelg](https://github.com/terkelg))

# **Project Screencasts**

If your project is becoming more involved or you’re launching your project to a wider audience, including walkthrough video(s) can really help with user onboarding and support.

## **Screenflow**

My go-to screen recording software is [ScreenFlow](https://www.telestream.net/screenflow/overview.htm), which is not cheap at $129, but gives you a lot of powerful, quality tools for the price, including precise rectangular screen recording, video and audio track mixing, audio voiceovers, transition effects, and more. This type of screencast is quite a bit more complicated than the screenshots and terminal session recordings we were looking at earlier.

# **Conclusion**

Developer UX is important for promoting and marketing your work, which can in turn lead to very real consequences, as getting noticed for your open source contributions is definitely one of the best ways to gain notoriety and land big job opportunities as a software engineer.

I hope some of the techniques I’ve covered help you to promote your open source projects. If you’ve found this article useful and end up creating a snazzy screenshot or animated demo, add a comment linking to your project and let me know!

And as always, don’t forget to spread the ❤️… in the form of beautiful coding demos, of course!

---

Version français ci-dessous

# Introduction

Créer vos propres projets open source peut être extrêmement gratifiant, mais il peut être difficile de se démarquer et de convaincre d'autres développeurs de faire confiance et d'utiliser votre logiciel. Vous pouvez gagner beaucoup de terrain en suivant les [meilleures pratiques courantes](https://opensource.guide/) telles que l'inclusion d'une documentation solide, l'ajout de tests unitaires, l'intégration avec un CI/CD orienté vers les projets open source (comme travis-ci ou circle-ci), et l'application de conventions de style cohérentes.

L'une des façons les plus efficaces et les plus faciles que j'ai trouvées pour faire vraiment ressortir les projets open source de la foule est d'**ajouter des captures d'écran de qualité ou des démonstrations animées**. Chaque fois que je vois cette attention aux détails, non seulement cela me prouve que l'auteur se soucie du projet, mais c'est également le moyen le plus rapide de transmettre ce que fait réellement le projet.

![](/assets/blog/code-snippets/css-coding.gif)

Crédit de l'animation : [Animation de codage CSS uniquement](http://chrisdermody.com/css-only-coding-animation/) par [Chris Dermody](http://chrisdermody.com/)

> Une image vaut mille mots. - Expression clichée qui est totalement pertinente.
> 

Inclure des captures d'écran et des démonstrations de qualité devient de plus en plus important dans ce que j'appellerais l'**expérience utilisateur du développeur**, c'est-à-dire le cheminement qu'un développeur potentiel suit depuis la considération d'ajouter votre projet en tant que dépendance jusqu'à l'intégration réussie et la maintenance future.

À cette fin, nous examinerons trois cas d'utilisation courants pour améliorer l'expérience utilisateur du développeur de vos projets open source avec des médias :

- Extraits de code statiques (images)
- Démos de code animées (GIF ou SVG animés)
- Captures d'écran de projet (vidéos)

# Extraits de code statiques

Le partage de petits morceaux de code statique est certainement le cas d'utilisation le plus courant et le plus important de cette liste. Le readme de chaque projet open source devrait inclure un extrait d'exemple facilement analysable, commençons donc par là.

## Extraits de code en markdown compatible avec GitHub

Au niveau le plus simple, GitHub permet la coloration syntaxique dans les extraits de code en markdown. J'espère que ce style d'intégration vous est familier, et si ce n'est pas le cas, je vous recommande vivement de commencer ici.

```jsx
const pMap = require('p-map')
const got = require('got')

const sites = [
  getWebsiteFromUsername('sindresorhus'), //=> Promise
  'ava.li',
  'todomvc.com',
  'github.com'
]

const mapper = el => got.head(el).then(res => res.requestUrl)

pMap(sites, mapper, { concurrency: 2 })
  .then(result => {
    console.log(result)
    //=> ['<http://sindresorhus.com/>', '<http://ava.li/>', '<http://todomvc.com/>', '<http://github.com/>']
  })

```

## Gists GitHub

L'extrait de code ci-dessus fournit également un exemple d'une manière extrêmement populaire de partager des extraits de code statiques via les Gists GitHub, qui présentent les avantages suivants :

- Liens
- Prise en charge de la version
- Prise en charge des discussions via les commentaires
- Coloration syntaxique

## Carbon

Les extraits de code en markdown et les Gists GitHub sont tous deux utiles, mais si vous voulez vraiment rendre votre code attrayant, alors ne cherchez pas plus loin que Carbon.

![](/assets/blog/code-snippets/carbon.png)

Crédit de l'image : [Carbon](https://github.com/dawnlabs/carbon)

Carbon est un projet open source très populaire qui vous permet de créer facilement des captures d'écran de code esthétiquement plaisantes, avec de nombreuses options de personnalisation et des plugins communautaires. C'est un excellent choix pour rendre votre readme plus attrayant, augmenter l'engagement sur les réseaux sociaux ou écrire des articles de blog liés à l'ingénierie comme celui-ci.

# Démos de code animées

Inclure une démonstration en ligne de haute qualité qui illustre rapidement le cas d'utilisation principal de votre projet est la suggestion la plus importante que je puisse donner.

Il existe de nombreuses façons de créer ce type de démonstrations, mais j'aimerais discuter de ce que j'ai trouvé être la meilleure approche ici.

> Asciinema est un outil gratuit qui vous permet d'enregistrer et de partager vos sessions de terminal, de la bonne manière.
> 

Asciinema fournit une approche légère et purement textuelle pour l'enregistrement de terminal, ce qui vous permet de réaliser des enregistrements sans perte qui peuvent ensuite être partagés directement ou convertis en SVG animé, en GIF animé ou en vidéo. J'ai été surpris de constater à quel point de nombreux projets open source populaires sur GitHub utilisent Asciinema - je vous recommande vivement d'y jeter un coup d'œil.

![](/assets/blog/code-snippets/crl.gif)

Exemple de capture d'écran Asciinema convertie en GIF (crédit : [create-react-library](https://github.com/transitive-bullshit/create-react-library)) Notez que la qualité de ce GIF intégré est bien inférieure à celle du SVG animé dans le [readme](https://github.com/transitive-bullshit/create-react-library) lié comme discuté ci-dessous.

## SVG animé ou GIF ?

Nous savons tous que les GIF sont un format horriblement inefficace et destructeur, mais creusons un peu plus dans ce cas d'utilisation particulier.

Comparez le GIF intégré ci-dessus à l'animation SVG animée de la même capture d'écran provenant du [readme](https://github.com/transitive-bullshit/create-react-library). Il est difficile d'incorporer une comparaison en ligne côte à côte, mais le SVG animé est nettement plus net et plus petit, avec une taille de 73 ko contre 4,4 Mo pour le GIF de moins bonne qualité.

Pourquoi discuter de cela alors ? Eh bien, vous ne pouvez pas exactement inclure de code HTML personnalisé dans un article de blog Medium, n'est-ce pas ? Et d'ailleurs, il y a beaucoup d'endroits où l'utilisation de SVG animés personnalisés ne fonctionnera pas, et pour l'instant, les GIF continueront d'être utilisés en tant que solution de secours pour ces cas d'utilisation. Mais chers auteurs de projets open source, veuillez envisager d'utiliser des SVG animés plutôt que des GIF pour vos projets GitHub !

Il existe de nombreux projets open source très populaires sur GitHub qui ont commencé à utiliser des SVG animés plus efficaces pour leurs démonstrations, tels que create-react-app, mais en général, vous constaterez que les GIF sont beaucoup plus courants.

Voici quelques exemples d'utilisation de l'excellent [svg-term-cli](https://github.com/marionebl/svg-term-cli) pour générer notre SVG animé sans perte.

```bash
# générer un SVG animé
svg-term --cast 'fxdtpprue51QZkeViQurqPg8V' --out demo.svg --window --width=80 --height=24 --term=iterm2 --profile=Snazzy

# générer un SVG à une seule image à 20 secondes de la capture d'écran
svg-term --cast 'fxdtpprue51QZkeViQurqPg8V' --out screenshot.svg --window --width=80 --height=24 --term=iterm2 --profile=Snazzy --at 20000

```

Il est important de noter que lorsqu'il est question de SVG animés, nous parlons en réalité d'intégrer un extrait de code HTML dans du markdown compatible avec GitHub, qui lie un fichier SVG animé comprenant chaque image sous forme de groupe SVG et l'animation définie via des keyframes CSS (exemple de source SVG).

```html
<p align="center">
  <img width="600" src="<https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/demo.svg>">
</p>

```

Insérez cet extrait de code HTML dans n'importe quel fichier markdown compatible avec GitHub pour intégrer le SVG animé lié avec une netteté optimale et une faible taille par rapport à un GIF comparable.

Pour référence, voici la capture d'écran de create-react-library que nous avons utilisée comme exemple dans différents formats :

- Asciicast original
- SVG animé de haute qualité créé avec svg-term-cli
- GIF de faible qualité créé avec asciicast2gif

## Capture et optimisation des GIF

Asciinema est excellent pour l'enregistrement basé sur le terminal, mais que faire si vous voulez enregistrer un composant d'interface utilisateur ou un site web ? Eh bien, ma première réponse ici est toujours d'inclure une démo utilisable si possible avec votre projet, surtout s'il s'agit d'un projet web frontend. Il est très facile de commencer avec l'hébergement gratuit de GitHub Pages !

Si vous souhaitez tout de même inclure un GIF, je vous recommande d'utiliser soit GIPHY Capture, soit Kap pour enregistrer votre écran et générer un GIF. Alternativement, si vous disposez d'une vidéo enregistrée à partir d'une autre source, je vous recommande d'utiliser Gifski pour convertir la vidéo en un GIF aussi optimisé que possible pour faciliter l'intégration.

```markdown
<!-- extrait de code HTML personnalisant le GIF intégré -->
<img src="<https://cdn.rawgit.com/terkelg/prompts/master/media/number.gif>" alt="exemple de prompt" width="499" height="103" />

<!-- le markdown brut peut également être utilisé pour intégrer un GIF -->
![](/assets/blog/code-snippets/number.gif%3E)

```

![](/assets/blog/code-snippets/prompts.gif)

Démo GIF de qualité intégrée dans le readme en utilisant l'extrait ci-dessus. (crédit de l'image : [prompts](https://github.com/terkelg/prompts) par [terkelg](https://github.com/terkelg))

# Captures d'écran du projet

Si votre projet devient plus complexe ou si vous le lancez à un public plus large, l'inclusion de vidéos explicatives peut vraiment aider pour l'intégration et le support des utilisateurs.

## Screenflow

Mon logiciel d'enregistrement d'écran de prédilection est ScreenFlow, qui n'est pas bon marché à 129 $, mais qui offre de nombreux outils puissants et de qualité pour ce prix, notamment l'enregistrement précis de l'écran rectangulaire, le m
