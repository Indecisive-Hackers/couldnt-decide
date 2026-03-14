docker run --name cant-decide \
    -p 5432:5432 \
    -e POSTGRES_DB=cant-decide \
    -e POSTGRES_PASSWORD=cat \
    -d postgres > database.txt
echo "Database up"
sleep 4
cd backend/
./bootstrap.sh
echo "Backend up"
cd ../
cd frontend/
ng serve &
echo $! > ../frontend.txt
echo "Frontend up"
cd ../
echo "Done"