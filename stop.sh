xargs docker kill < database.txt
xargs docker rm < database.txt
xargs kill < backend.txt
xargs kill < frontend.txt
rm database.txt
rm backend.txt
rm frontend.txt
