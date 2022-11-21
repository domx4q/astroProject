"""
This script should check git every 5 minutes for changes and update the repo if changes are found.
(use python 3.6)
"""

import os
import time
import subprocess


class Update:
    def __init__(self):
        self.lastSubprocess = None

    def update(self):
        # use subprocess to update the repo because the serve server would prevent the update
        # call the updateServer.sh script
        self.lastSubprocess = subprocess.Popen(["./updateServer.sh"], shell=True)

    def checkForUpdates(self):
        # use git to check for changes
        subprocess.call(["git", "fetch"])
        subprocess.call(["git", "checkout", "test_update"])
        subprocess.call(["git", "reset", "--hard", "origin/master"])
        return subprocess.call(["git", "diff", "--quiet", "HEAD", "origin/master"]) != 0
    def main(self):
        while True:
            if self.checkForUpdates():
                print("Update found")
                if self.lastSubprocess is not None:
                    # kill the last subprocess if it is still running
                    self.lastSubprocess.kill()
                self.update()
            else:
                print("No update found")
                print("Sleeping for 5 minutes")
            time.sleep(300)


if __name__ == '__main__':
    update = Update()
    update.main()