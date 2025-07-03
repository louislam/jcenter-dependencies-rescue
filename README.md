# JCenter Mirror

Last chance to rescue and backup your JCenter dependencies!

Well... Since I am not really a major Android developer, I just don't know JCenter has been shut down until now. My Android app is completely broken and can not be built anymore.

The official guide taught you to migrate to Maven Central, but not all dependencies are available there.

Luckily, I found Aliyun has a mirror of JCenter, which is still available, so I wrote this script to backup my JCenter dependencies to a local directory.

> **Warning**
> Aliyun could possibly shut down their JCenter mirror at any time, so you should backup your dependencies as soon as possible.

## Features

- Rescue you Android projects that depend on JCenter.
- Backup your JCenter dependencies to a local directory.
- Mainly for Android

## How to Use

1. Install [Deno 2.X](https://docs.deno.com/runtime/)
2. `git clone https://github.com/louislam/jcenter-mirror` or download this repo
3. `cd jcenter-mirror`
3. Start the server by `deno task start`
4. Now go to your Android project and add the following to your `build.gradle`:

    ```groovy
    maven {
        url "http://localhost:8000"
        allowInsecureProtocol = true
    }
    ```
    
    For example, it should look like this:
    
    ```groovy
    buildscript {
        repositories {
            google()
            mavenCentral()
            maven {
                url "http://localhost:8000"
                allowInsecureProtocol = true
            }
        }
    }
    ```

5. Press "Sync Now" in Android Studio, and it should download all dependencies from the local server, and it will cache into `./data`.

So next time when you need the dependencies, you can start the server again.

## Local Server-less

In case you don't want to start a local server, it seems that you can point to a local path directly. I haven't tested this yet, but it should work.

Absolute path example:

```groovy
maven {
    url "file:///full/path/to/your/jcenter-mirror/data"
}
```

Relative path example:

```groovy
maven {
   url = uri("${project.getRootDir()}/sample-project")
}
```

Reference: https://stackoverflow.com/a/73216136/1097815


## Side Notes

- The experience of Android development is just terrible. I have several Android projects in over 10 years, and I have to migrate them every few years. Things that claimed to be "best practice", and next year it may become deprecated.
