# Ionic/TypeScript Starter Project

Welcome to the documentation for the [Ionic/TypeScript Starter Project](https://github.com/Justin-Credible/Ionic-TypeScript-Starter).

## Overview

When the [Ionic Framework](http://ionicframework.com/) was released I knew it would make developing cross platform hybrid applications much easier than trying to cobble together my own framework. Its focus on looking and performing like a native app was icing on the cake.

Around the same time I discovered Ionic, I also learning [TypeScript](typescriptlang.org) for refactoring large enterprise applications. After seeing the power of TypeScript's code insight for rich IDE tooling and compile time checking, I never wanted to go back to vanilla JavaScript.

I had been wanted to get into mobile app development for a while, and Ionic and TypeScript, coupled with the free [Visual Studio Code](https://code.visualstudio.com/) IDE made this an attrictive solution for cross platform development.

## Features

<div id="screenshots">

  <img src="/img/screenshot_1.jpg" class="img-responsive">
  <img src="/img/screenshot_2.jpg" class="img-responsive">
  <img src="/img/screenshot_3.jpg" class="img-responsive">
  <img src="/img/screenshot_4.jpg" class="img-responsive">
  <img src="/img/screenshot_5.jpg" class="img-responsive">
  <img src="/img/screenshot_6.jpg" class="img-responsive">

</div>

## Where to Start?

The starter project template targets iOS, Android, and Chrome (as an extension). Development can be done on Mac OS, Linux, or Windows with your favorite IDE or text editor. I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor as it has superb support for TypeScript. This project also includes VS Code task mappings to the various gulp tasks.

To begin, take look at [Getting Started](getting-started.md) for information on pre-requisites and instructions on how to setup your development environment.

Next, I recommend examining the project layout and [Gulp Tasks](gulp-tasks.md).

Finally, you can learn about the functionality that is included with the [Base Framework](base-framework.md) and get some [Development Tips](development-tips.md).

!!! note
	If you are developing on Windows or Linux and intend to create iOS builds, you'll want to check out [Running iOS Simulator Remotely](development-tips.md#running-ios-simulator-remotely) for more details on how to use a remote OS X machine to create your iOS builds.

## Why?

I put this starter project together as a result of looking for examples on how to use TypeScript with an Ionic/Angular application. There were several simple code snippets and examples out there, but nothing that showed how to structure an entire mobile application.

In addition, most examples I found didn't really take full advantage of TypeScript in my opinion. I wanted to explore what a well structured mobile application could look like and avoid the deeply nested annonymous JavaScript functions pattern I commonly ran across.

My goal is a clean and easy to read codebase that should be intuitive for anyone to get started with, even those without much Ionic or Angular experience.

## "Framework" vs "Starter Project"

My intention here is not to create a complete application framework, but instead provide an example of how you can structure your Ionic application using TypeScript.

The distinction here is that you won't download a ZIP file or drop in a pre-built library to your application to use this project. Instead, this project is a reference or starting point for your own application.

While there is some framework-like functionality included (base controller classes, dialog helpers, utility classes, etc) it is all optional and can be used (or omitted!) at your own discretion. See [Base Framework](base-framework.md) for more details on what is included.

Also, I suggest restructuring the application to fit your needs. Don't like gulp? Switch to your favorite task runner. Don't like the directory layout? Move files around to suit your preference.

