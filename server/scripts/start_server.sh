#!/bin/bash
cd /home/ec2-user/app
pm2 delete WebServer || true
pm2 --name WebServer start npm -- start
