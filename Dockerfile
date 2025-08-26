# Stage 1: Build the SvelteKit application
FROM denoland/deno:latest AS builder
WORKDIR /app

# Copy SvelteKit project files
COPY . .

# Install Deno dependencies and build the SvelteKit app
# Adjust these commands based on your SvelteKit setup and Deno tasks
RUN deno cache --reload --lock=deno.lock && \
    deno run build

# Stage 2: Create the final runtime image
FROM denoland/deno:latest
WORKDIR /app

# Copy the built SvelteKit app from the builder stage
COPY --from=builder /app/build /app/build
COPY --from=builder /app/deno.json /app/deno.json 

# Expose the port your SvelteKit app listens on (e.g., 3000)
EXPOSE 3000

# Command to run the SvelteKit application
# Adjust this based on how your SvelteKit app is served (e.g., using adapter-node)
CMD ["deno", "run", "--allow-net", "--allow-read", "build/index.js"]